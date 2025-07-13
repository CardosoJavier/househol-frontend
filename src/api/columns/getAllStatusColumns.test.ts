import { getAllStatusColumns } from "./getAllStatusColumn";
import { StatusColumnProps } from "../../models/board/StatusColumn";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("getAllStatusColumns", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;
  const mockSupabaseFrom = require("../../utils/supabase/component").supabase
    .from;

  afterEach(() => {
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
        task: [],
      },
    ];

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    const mockEq = jest.fn().mockResolvedValueOnce({
      data: mockStatusColumns,
      error: null,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabaseFrom.mockReturnValue({
      select: mockSelect,
    });

    const result = await getAllStatusColumns();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(mockSupabaseFrom).toHaveBeenCalledWith("status_columns");
    expect(result).toEqual(mockStatusColumns);
  });

  it("should return an empty array if user ID is missing", async () => {
    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    const result = await getAllStatusColumns();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should return an empty array if Supabase returns an error", async () => {
    const mockUserId = "user123";
    const mockError = { message: "Database error" };

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    const mockEq = jest.fn().mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabaseFrom.mockReturnValue({
      select: mockSelect,
    });

    const result = await getAllStatusColumns();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(mockSupabaseFrom).toHaveBeenCalledWith("status_columns");
    expect(result).toEqual([]);
  });

  it("should return an empty array if an unexpected error occurs", async () => {
    mockSupabaseAuth.getSession.mockRejectedValueOnce(
      new Error("Unexpected error")
    );

    const result = await getAllStatusColumns();

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
