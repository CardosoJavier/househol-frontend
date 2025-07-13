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

describe("signIn", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;

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

    mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({
      data: mockResponse,
      error: null,
    });

    const result = await signIn(mockEmail, mockPassword);

    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should return an AuthError if sign-in fails", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "wrongpassword";
    const mockError: AuthError = {
      message: "Invalid login credentials",
      status: 401,
    } as AuthError;

    mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    const result = await signIn(mockEmail, mockPassword);

    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(result).toEqual(mockError);
  });

  it("should handle unexpected errors gracefully", async () => {
    const mockEmail = "test@example.com";
    const mockPassword = "password123";

    mockSupabaseAuth.signInWithPassword.mockRejectedValueOnce(
      new Error("Unexpected error")
    );

    const result = await signIn(mockEmail, mockPassword);

    expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(result).toBeUndefined();
  });
});
