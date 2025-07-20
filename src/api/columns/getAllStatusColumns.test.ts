import { getAllStatusColumns } from "./getAllStatusColumn";
import { StatusColumnProps } from "../../models/board/StatusColumn";

// Mock the API wrapper
jest.mock("../apiWrapper", () => ({
  apiWrapper: jest.fn(),
}));

// Mock the constants
jest.mock("../../constants", () => ({
  GENERIC_ERROR_MESSAGES: {
    COLUMN_LOAD_FAILED: "Unable to load columns. Please refresh the page.",
  },
}));

// Mock supabase
jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("getAllStatusColumns", () => {
  const mockApiWrapper = require("../apiWrapper").apiWrapper;
  const mockSupabase = require("../../utils/supabase/component").supabase;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully retrieve status columns", async () => {
    const mockStatusColumns: StatusColumnProps[] = [
      {
        id: 1,
        title: "To Do",
        status: "pending",
        updatedAt: new Date(),
        createdAt: new Date(),
        task: [],
      },
    ];

    // Mock the wrapper to return success with data
    mockApiWrapper.mockResolvedValueOnce({
      success: true,
      data: mockStatusColumns,
      error: null,
    });

    const result = await getAllStatusColumns();

    expect(result).toEqual(mockStatusColumns);
    expect(mockApiWrapper).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        showErrorToast: false,
        errorMessage: "Unable to load columns. Please refresh the page.",
      })
    );
  });

  it("should return empty array when the API call fails", async () => {
    // Mock the wrapper to return failure
    mockApiWrapper.mockResolvedValueOnce({
      success: false,
      data: null,
      error: new Error("Database error"),
    });

    const result = await getAllStatusColumns();

    expect(result).toEqual([]);
    expect(mockApiWrapper).toHaveBeenCalled();
  });

  it("should pass the correct operation to apiWrapper", async () => {
    const mockUserId = "user123";
    const mockStatusColumns: StatusColumnProps[] = [];

    // Mock session
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    // Mock select operation
    const mockEq = jest.fn().mockResolvedValueOnce({
      data: mockStatusColumns,
      error: null,
    });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ select: mockSelect });

    // Mock the wrapper to call the operation function
    mockApiWrapper.mockImplementationOnce(async (operation: any) => {
      const result = await operation();
      return { success: true, data: result.data, error: result.error };
    });

    await getAllStatusColumns();

    expect(mockSupabase.from).toHaveBeenCalledWith("status_columns");
    expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining("*"));
    expect(mockEq).toHaveBeenCalledWith("task.user_id", mockUserId);
  });

  it("should handle missing user session", async () => {
    // Mock no user session
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
    });

    // Mock the wrapper to handle the error
    mockApiWrapper.mockImplementationOnce(async (operation: any) => {
      try {
        await operation();
      } catch (error) {
        return { success: false, data: null, error };
      }
    });

    const result = await getAllStatusColumns();

    expect(result).toEqual([]);
  });
});
