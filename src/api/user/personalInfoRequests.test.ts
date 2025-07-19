import { getPersonalInfo } from "./personalInfoResquests";
import { PersonalInfo } from "../../models";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("getPersonalInfo", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;
  const mockSupabaseFrom = require("../../utils/supabase/component").supabase
    .from;

  beforeEach(() => {
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

  it("should fetch personal info from Supabase if no cached data exists", async () => {
    const mockUserId = "user123";
    const mockPersonalInfo: PersonalInfo = {
      id: "id",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      profilePictureUrl: "www.test.com",
    };

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: [mockPersonalInfo],
          error: null,
        }),
      }),
    });

    const result = await getPersonalInfo();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(mockSupabaseFrom).toHaveBeenCalledWith("users");
    expect(result).toEqual(mockPersonalInfo);
  });

  it("should return null if Supabase returns an error", async () => {
    const mockUserId = "user123";

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabaseFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: null,
          error: { message: "Error fetching data" },
        }),
      }),
    });

    const result = await getPersonalInfo();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("should return null if an unexpected error occurs", async () => {
    mockSupabaseAuth.getSession.mockRejectedValueOnce(
      new Error("Unexpected error")
    );

    const result = await getPersonalInfo();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
