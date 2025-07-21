import { deleteTaskById } from "./deleteTaskById";

// Mock the API wrapper
jest.mock("../apiWrapper", () => ({
  dbOperationWrapper: jest.fn(),
}));

// Mock the constants
jest.mock("../../constants", () => ({
  GENERIC_ERROR_MESSAGES: {
    TASK_DELETE_FAILED: "Unable to delete task. Please try again.",
  },
  GENERIC_SUCCESS_MESSAGES: {
    TASK_DELETED: "Task deleted successfully!",
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

jest.mock("../../components/notifications/CustomToast", () => ({
  showToast: jest.fn(),
}));

describe("deleteTaskById", () => {
  const mockDbOperationWrapper = require("../apiWrapper").dbOperationWrapper;
  const mockSupabase = require("../../utils/supabase/component").supabase;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a task by ID", async () => {
    const mockTaskId = "task123";

    // Mock the wrapper to return true (success)
    mockDbOperationWrapper.mockResolvedValueOnce(true);

    const result = await deleteTaskById(mockTaskId);

    expect(result).toBe(true);
    expect(mockDbOperationWrapper).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: "Task deleted successfully!",
        errorMessage: "Unable to delete task. Please try again.",
      })
    );
  });

  it("should handle errors gracefully", async () => {
    const mockTaskId = "task123";

    // Mock the wrapper to return false (failure)
    mockDbOperationWrapper.mockResolvedValueOnce(false);

    const result = await deleteTaskById(mockTaskId);

    expect(result).toBe(false);
    expect(mockDbOperationWrapper).toHaveBeenCalled();
  });

  it("should pass the correct operation to dbOperationWrapper", async () => {
    const mockTaskId = "task123";
    const mockUserId = "user123";

    // Mock session
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    // Mock delete operation
    const mockEq = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValueOnce({ error: null }),
    });
    const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ delete: mockDelete });

    // Mock the wrapper to call the operation function
    mockDbOperationWrapper.mockImplementationOnce(async (operation: any) => {
      await operation();
      return true;
    });

    await deleteTaskById(mockTaskId);

    expect(mockSupabase.from).toHaveBeenCalledWith("task");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", mockTaskId);
    expect(mockEq().eq).toHaveBeenCalledWith("user_id", mockUserId);
  });
});
