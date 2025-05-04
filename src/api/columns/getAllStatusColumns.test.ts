import { getAllStatusColumns } from "./getAllStatusColumn";
import { createClient } from "../../utils/supabase/component";
import { StatusColumnProps } from "../../models/board/StatusColumn";

jest.mock("../../utils/supabase/component", () => ({
  createClient: jest.fn(),
}));

describe("getAllStatusColumns", () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    jest.clearAllMocks();
  });

  it("should successfully retrieve status columns", async () => {
    const mockUserId = "user123";
    const mockStatusColumns: StatusColumnProps[] = [
      {
        id: 1,
        title: "To Do",
        status: "pendin",
        updatedAt: new Date(),
        createdAt: new Date(),
        task: []
      },
    ];

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: mockStatusColumns,
          error: null,
        }),
      }),
    });

    const result = await getAllStatusColumns();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("statusColumn");
    expect(result).toEqual(mockStatusColumns);
  });

  it("should return an empty array if user ID is missing", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    const result = await getAllStatusColumns();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should return an empty array if Supabase returns an error", async () => {
    const mockUserId = "user123";
    const mockError = { message: "Database error" };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({
          data: null,
          error: mockError,
        }),
      }),
    });

    const result = await getAllStatusColumns();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("statusColumn");
    expect(result).toEqual([]);
  });

  it("should return an empty array if an unexpected error occurs", async () => {
    mockSupabase.auth.getSession.mockRejectedValueOnce(new Error("Unexpected error"));

    const result = await getAllStatusColumns();

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});