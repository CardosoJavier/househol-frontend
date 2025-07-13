import { updateTaskById } from "./updateTaskById";
import { TaskInput } from "../../models/board/Task";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("updateTaskById", () => {
  const mockSupabaseFrom = require("../../utils/supabase/component").supabase
    .from;

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
    };

    mockSupabaseFrom.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({ error: null }),
      }),
    });

    const result = await updateTaskById(mockTaskInput);

    expect(mockSupabaseFrom).toHaveBeenCalledWith("task");
    expect(result).toBe(true);
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
    };

    mockSupabaseFrom.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({ error: { message: "Error" } }),
      }),
    });

    const result = await updateTaskById(mockTaskInput);

    expect(result).toBe(false);
  });
});
