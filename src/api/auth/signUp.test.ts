import { signUp } from "./signUp";
import { createClient } from "../../utils";
import { SignUpType } from "../../models";

jest.mock("../../utils", () => ({
  createClient: jest.fn(),
}));

describe("signUp", () => {
  const mockSupabase = {
    auth: {
      signUp: jest.fn(),
    },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

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

    mockSupabase.auth.signUp.mockResolvedValueOnce({ error: null });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "john.doe@example.com",
      password: "password123",
      options: {
        data: {
          first_name: "John",
          last_name: "Doe",
        },
      },
    });
    expect(result).toBeUndefined(); // No error should be returned
  });

  it("should return an error if sign-up fails", async () => {
    const mockUserInfo: SignUpType = {
      name: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
    };

    const mockError = { message: "Sign-up failed" };
    mockSupabase.auth.signUp.mockResolvedValueOnce({ error: mockError });

    const result = await signUp({ userInfo: mockUserInfo });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "jane.smith@example.com",
      password: "password123",
      options: {
        data: {
          first_name: "Jane",
          last_name: "Smith",
        },
      },
    });
    expect(result).toEqual(mockError); // Error should be returned
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