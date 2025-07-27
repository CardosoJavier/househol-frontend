import { signIn } from "./signIn";
import { AuthError } from "@supabase/supabase-js";
import { SuccessfulSignInResponse } from "../../models";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
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

describe("signIn", () => {
  const { sanitizeInput } = require("../../utils/inputSanitization");
  const { apiWrapper } = require("../apiWrapper");
  const { showToast } = require("../../components/notifications/CustomToast");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully sign in a user", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "password123";
    const mockResponse: SuccessfulSignInResponse = {
      user: {
        id: "123",
        email: mockEmail,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2023-01-01T00:00:00Z",
      },
      session: {
        access_token: "token123",
        refresh_token: "refreshToken123",
        expires_in: 3600,
        token_type: "bearer",
        user: {
          id: "123",
          email: mockEmail,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: "2023-01-01T00:00:00Z",
        },
      },
    };

    // Mock successful sanitization
    sanitizeInput.mockReturnValue({
      success: true,
      data: { email: mockEmail, password: mockPassword },
    });

    // Mock successful API wrapper
    apiWrapper.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const result = await signIn(mockEmail, mockPassword);

    expect(sanitizeInput).toHaveBeenCalledWith(expect.any(Object), {
      email: mockEmail,
      password: mockPassword,
    });
    expect(apiWrapper).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it("should return an AuthError if sign-in fails", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "wrongpassword";
    const mockError: AuthError = {
      message: "Invalid login credentials",
      status: 401,
    } as AuthError;

    // Mock successful sanitization
    sanitizeInput.mockReturnValue({
      success: true,
      data: { email: mockEmail, password: mockPassword },
    });

    // Mock API wrapper returning error with status
    apiWrapper.mockResolvedValue({
      success: false,
      error: mockError,
    });

    const result = await signIn(mockEmail, mockPassword);

    expect(sanitizeInput).toHaveBeenCalledWith(expect.any(Object), {
      email: mockEmail,
      password: mockPassword,
    });
    expect(apiWrapper).toHaveBeenCalled();
    expect(result).toEqual(mockError);
  });

  it("should handle unexpected errors gracefully", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "password123";

    // Mock successful sanitization
    sanitizeInput.mockReturnValue({
      success: true,
      data: { email: mockEmail, password: mockPassword },
    });

    // Mock API wrapper returning generic error (no status)
    apiWrapper.mockResolvedValue({
      success: false,
      error: new Error("Unexpected error"),
    });

    const result = await signIn(mockEmail, mockPassword);

    expect(sanitizeInput).toHaveBeenCalledWith(expect.any(Object), {
      email: mockEmail,
      password: mockPassword,
    });
    expect(apiWrapper).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should handle validation failure", async () => {
    const email = "invalid-email";
    const password = "";

    // Mock failed sanitization
    sanitizeInput.mockReturnValue({
      success: false,
      error: "Invalid email format",
    });

    const result = await signIn(email, password);

    expect(sanitizeInput).toHaveBeenCalledWith(expect.any(Object), {
      email,
      password,
    });
    expect(showToast).toHaveBeenCalledWith(expect.any(String), "error");
    expect(result).toEqual({ message: "Invalid email or password" });
    expect(apiWrapper).not.toHaveBeenCalled();
  });
});
