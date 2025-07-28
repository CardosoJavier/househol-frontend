import { PostgrestError, AuthError } from "@supabase/supabase-js";
import { apiWrapper, authApiWrapper, dbOperationWrapper, withUserSession } from "./apiWrapper";
import { showToast } from "../components/notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, GENERIC_SUCCESS_MESSAGES } from "../constants";
import * as supabaseModule from "../utils";

// Mock dependencies
jest.mock("../components/notifications/CustomToast");
jest.mock("../utils", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe("apiWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful operations", async () => {
    const mockData = { id: 1, name: "Test" };
    const operation = jest.fn().mockResolvedValue({ data: mockData, error: null });

    const result = await apiWrapper(operation);

    expect(result).toEqual({
      data: mockData,
      error: null,
      success: true,
    });
    expect(showToast).not.toHaveBeenCalled();
  });

  it("should show success toast when configured", async () => {
    const mockData = { id: 1, name: "Test" };
    const operation = jest.fn().mockResolvedValue({ data: mockData, error: null });

    await apiWrapper(operation, { showSuccessToast: true });

    expect(showToast).toHaveBeenCalledWith(
      GENERIC_SUCCESS_MESSAGES.ACTION_COMPLETED,
      "success"
    );
  });

  it("should handle Supabase errors", async () => {
    const mockError: PostgrestError = {
      message: "Database error",
      details: "Error details",
      hint: "Error hint",
      code: "23505",
      name: "PostgrestError"
    };
    const operation = jest.fn().mockResolvedValue({ error: mockError });

    const result = await apiWrapper(operation);

    expect(result).toEqual({
      data: undefined,
      error: mockError,
      success: false,
    });
    expect(showToast).toHaveBeenCalledWith(
      GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR,
      "error"
    );
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    const operation = jest.fn().mockRejectedValue(mockError);

    const result = await apiWrapper(operation);

    expect(result).toEqual({
      data: undefined,
      error: mockError,
      success: false,
    });
    expect(showToast).toHaveBeenCalledWith(
      GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR,
      "error"
    );
  });

  it("should not show error toast when disabled", async () => {
    const mockError = new Error("Test error");
    const operation = jest.fn().mockRejectedValue(mockError);

    await apiWrapper(operation, { showErrorToast: false });

    expect(showToast).not.toHaveBeenCalled();
  });
});

describe("authApiWrapper", () => {
  it("should handle successful auth operations", async () => {
    const mockData = { user: { id: 1 } };
    const operation = jest.fn().mockResolvedValue({ data: mockData, error: null });

    const result = await authApiWrapper(operation, { showSuccessToast: true });

    expect(result).toEqual({
      data: mockData,
      error: null,
      success: true,
    });
    expect(showToast).toHaveBeenCalledWith(
      GENERIC_SUCCESS_MESSAGES.ACTION_COMPLETED,
      "success"
    );
  });

  it("should handle auth session missing during logout", async () => {
    const mockError = new AuthError("Auth session missing!");
    const operation = jest.fn().mockResolvedValue({ error: mockError });

    const result = await authApiWrapper(operation, {
      showSuccessToast: true,
      successMessage: "Successfully signed out",
    });

    expect(result).toEqual({
      data: undefined,
      error: null,
      success: true,
    });
    expect(showToast).toHaveBeenCalledWith(
      "Successfully signed out",
      "success"
    );
  });

  it("should handle auth errors", async () => {
    const mockError = new AuthError("Invalid login credentials");
    const operation = jest.fn().mockResolvedValue({ error: mockError });

    const result = await authApiWrapper(operation);

    expect(result).toEqual({
      data: undefined,
      error: mockError,
      success: false,
    });
    expect(showToast).toHaveBeenCalledWith(
      GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED,
      "error"
    );
  });
});

describe("dbOperationWrapper", () => {
  it("should return true for successful operations", async () => {
    const operation = jest.fn().mockResolvedValue({ error: null });

    const result = await dbOperationWrapper(operation);

    expect(result).toBe(true);
  });

  it("should return false for failed operations", async () => {
    const mockError: PostgrestError = {
      message: "Database error",
      details: "Error details",
      hint: "Error hint",
      code: "23505",
      name: "PostgrestError"
    };
    const operation = jest.fn().mockResolvedValue({ error: mockError });

    const result = await dbOperationWrapper(operation);

    expect(result).toBe(false);
  });
});

describe("withUserSession", () => {
  const mockUserId = "test-user-id";
  const mockOperation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (supabaseModule.supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: mockUserId } } },
    });
  });

  it("should execute operation with user ID when session exists", async () => {
    mockOperation.mockResolvedValue({
      data: { result: "success" },
      error: null,
      success: true,
    });

    const result = await withUserSession(mockOperation);

    expect(mockOperation).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      data: { result: "success" },
      error: null,
      success: true,
    });
  });

  it("should handle missing user session", async () => {
    (supabaseModule.supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    const result = await withUserSession(mockOperation);

    expect(mockOperation).not.toHaveBeenCalled();
    expect(result).toEqual({
      data: undefined,
      error: new Error("No user session"),
      success: false,
    });
    expect(showToast).toHaveBeenCalledWith("Please sign in to continue.", "error");
  });

  it("should handle session retrieval errors", async () => {
    const mockError = new Error("Failed to get session");
    (supabaseModule.supabase.auth.getSession as jest.Mock).mockRejectedValue(
      mockError
    );

    const result = await withUserSession(mockOperation);

    expect(mockOperation).not.toHaveBeenCalled();
    expect(result).toEqual({
      data: undefined,
      error: mockError,
      success: false,
    });
    expect(showToast).toHaveBeenCalledWith(
      GENERIC_ERROR_MESSAGES.AUTH_SESSION_EXPIRED,
      "error"
    );
  });

  it("should not show error toast when disabled", async () => {
    (supabaseModule.supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    await withUserSession(mockOperation, { showErrorToast: false });

    expect(showToast).not.toHaveBeenCalled();
  });
});