import { signUp } from "./signUp";
import { SignUpType } from "../../models";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock("../../components/notifications/CustomToast", () => ({
  showToast: jest.fn(),
}));

jest.mock("../../utils/inputSanitization", () => ({
  sanitizeInput: jest.fn(),
}));

jest.mock("../apiWrapper", () => ({
  apiWrapper: jest.fn(),
}));

describe("signUp", () => {
  const { sanitizeInput } = require("../../utils/inputSanitization");
  const { apiWrapper } = require("../apiWrapper");
  const { showToast } = require("../../components/notifications/CustomToast");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully sign up a user", async () => {
    const mockUserInfo: SignUpType = {
      name: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    // Mock successful sanitization
    sanitizeInput.mockReturnValue({
      success: true,
      data: mockUserInfo,
    });

    // Mock successful API wrapper
    apiWrapper.mockResolvedValue({
      success: true,
      data: { user: { id: "123" }, session: null },
      error: null,
    });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(sanitizeInput).toHaveBeenCalledWith(
      expect.any(Object),
      mockUserInfo
    );
    expect(apiWrapper).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should return an error if sign-up fails", async () => {
    const mockUserInfo: SignUpType = {
      name: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
    };

    const mockError = { message: "Sign-up failed" };

    // Mock successful sanitization
    sanitizeInput.mockReturnValue({
      success: true,
      data: mockUserInfo,
    });

    // Mock API wrapper returning error
    apiWrapper.mockResolvedValue({
      success: false,
      error: mockError,
    });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(sanitizeInput).toHaveBeenCalledWith(
      expect.any(Object),
      mockUserInfo
    );
    expect(apiWrapper).toHaveBeenCalled();
    expect(result).toEqual(mockError);
  });

  it("should return an error if validation fails", async () => {
    const mockUserInfo: Partial<SignUpType> = {
      email: "missing.fields@example.com",
    };

    const validationError = "Name is required";

    // Mock failed sanitization
    sanitizeInput.mockReturnValue({
      success: false,
      error: validationError,
    });

    const result = await signUp({ userInfo: mockUserInfo as SignUpType });

    expect(sanitizeInput).toHaveBeenCalledWith(
      expect.any(Object),
      mockUserInfo
    );
    expect(showToast).toHaveBeenCalledWith(validationError, "error");
    expect(result).toEqual({ message: validationError });
    expect(apiWrapper).not.toHaveBeenCalled();
  });
});
