import { updateTaskById } from "./updateTaskById";
import { TaskInput } from "../../models/board/Task";

// Mock the API wrapper
jest.mock("../apiWrapper", () => ({
  dbOperationWrapper: jest.fn(),
}));

// Mock the constants
jest.mock("../../constants", () => ({
  GENERIC_ERROR_MESSAGES: {
    TASK_UPDATE_FAILED: "Unable to update task. Please try again.",
  },
  GENERIC_SUCCESS_MESSAGES: {
    TASK_UPDATED: "Task updated successfully!",
  },
}));

// Mock supabase
jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("updateTaskById", () => {
  const mockDbOperationWrapper = require("../apiWrapper").dbOperationWrapper;
  const mockSupabase = require("../../utils/supabase/component").supabase;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update a task by ID", async () => {
    const mockTaskInput: TaskInput = {
      id: "task1",
      description: "Updated task",
      dueDate: new Date(),
      dueTime: "12:00",
      priority: "Medium",
      columnId: 1,
      projectId: "id",
      status: "pending",
    };

    mockDbOperationWrapper.mockResolvedValueOnce(true);

    const result = await updateTaskById(mockTaskInput);

    expect(result).toBe(true);
    expect(mockDbOperationWrapper).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: "Task updated successfully!",
        errorMessage: "Unable to update task. Please try again.",
      })
    );
  });

  it("should return false if the update fails", async () => {
    const mockTaskInput: TaskInput = {
      id: "task1",
      description: "Updated task",
      dueDate: new Date(),
      dueTime: "12:00",
      priority: "Medium",
      columnId: 1,
      projectId: "id",
      status: "pending",
    };

    mockDbOperationWrapper.mockResolvedValueOnce(false);

    const result = await updateTaskById(mockTaskInput);

    expect(result).toBe(false);
    expect(mockDbOperationWrapper).toHaveBeenCalled();
  });

  it("should pass the correct operation to dbOperationWrapper", async () => {
    const mockTaskInput: TaskInput = {
      id: "task1",
      description: "Updated task",
      dueDate: new Date(),
      dueTime: "12:00",
      priority: "Medium",
      columnId: 1,
      projectId: "id",
      status: "pending",
    };

    const mockEq = jest.fn().mockResolvedValueOnce({ error: null });
    const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ update: mockUpdate });

    mockDbOperationWrapper.mockImplementationOnce(async (operation: any) => {
      await operation();
      return true;
    });

    await updateTaskById(mockTaskInput);

    expect(mockSupabase.from).toHaveBeenCalledWith("task");
    expect(mockUpdate).toHaveBeenCalledWith({
      column_id: mockTaskInput.columnId,
      description: mockTaskInput.description,
      priority: "medium",
      due_date: mockTaskInput.dueDate,
      due_time: mockTaskInput.dueTime,
      status: mockTaskInput.status,
    });
    expect(mockEq).toHaveBeenCalledWith("id", mockTaskInput.id);
  });
});
