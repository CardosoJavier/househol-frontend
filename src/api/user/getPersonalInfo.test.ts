import { getPersonalInfo } from "./getPersonalInfo";
import { createClient } from "../../utils";
import { decryptData, encryptData } from "../../utils/encrypt/encryption";
import { PersonalInfo } from "../../models";

jest.mock("../../utils", () => ({
  createClient: jest.fn(),
}));

jest.mock("../../utils/encrypt/encryption", () => ({
  decryptData: jest.fn(),
  encryptData: jest.fn(),
}));

describe("getPersonalInfo", () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    jest.clearAllMocks();

    // Mock sessionStorage
    Object.defineProperty(global, "sessionStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("should return cached personal info from sessionStorage", async () => {
    const mockCachedData = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });

    (sessionStorage.getItem as jest.Mock).mockReturnValueOnce(mockCachedData);
    (decryptData as jest.Mock).mockReturnValueOnce({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });

    const result = await getPersonalInfo();

    expect(sessionStorage.getItem).toHaveBeenCalledWith("personalInfo");
    expect(decryptData).toHaveBeenCalledWith(mockCachedData);
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
  });

  it("should fetch personal info from Supabase if no cached data exists", async () => {
    const mockUserId = "user123";
    const mockPersonalInfo: PersonalInfo = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
    };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: [mockPersonalInfo],
          error: null,
        }),
      }),
    });

    (encryptData as jest.Mock).mockResolvedValueOnce("encryptedData");

    const result = await getPersonalInfo();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(sessionStorage.setItem).toHaveBeenCalledWith("personalInfo", "encryptedData");
    expect(result).toEqual(mockPersonalInfo);
  });

  it("should return null if Supabase returns an error", async () => {
    const mockUserId = "user123";

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: null,
          error: { message: "Error fetching data" },
        }),
      }),
    });

    const result = await getPersonalInfo();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("should return null if an unexpected error occurs", async () => {
    mockSupabase.auth.getSession.mockRejectedValueOnce(new Error("Unexpected error"));

    const result = await getPersonalInfo();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});