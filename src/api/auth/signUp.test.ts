import { signUp } from "./signUp";
import { SignUpType } from "../../models";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe("signUp", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;

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

    mockSupabaseAuth.signUp.mockResolvedValueOnce({ error: null });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: "john.doe@example.com",
      password: "password123",
      options: {
        data: {
          first_name: "John",
          last_name: "Doe",
        },
      },
    });
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
    mockSupabaseAuth.signUp.mockResolvedValueOnce({ error: mockError });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
      email: "jane.smith@example.com",
      password: "password123",
      options: {
        data: {
          first_name: "Jane",
          last_name: "Smith",
        },
      },
    });
    expect(result).toEqual(mockError);
  });

  it("should throw an error if required fields are missing", async () => {
    const mockUserInfo: Partial<SignUpType> = {
      email: "missing.fields@example.com",
    };

    await expect(
      signUp({ userInfo: mockUserInfo as SignUpType })
    ).rejects.toThrow();
  });
});
