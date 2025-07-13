import { updateTaskById } from "./updateTaskById";
import { createClient } from "../../utils/supabase/component";
import { TaskInput } from "../../models/board/Task";

jest.mock("../../utils/supabase/component", () => ({
  createClient: jest.fn(),
}));

describe("updateTaskById", () => {
  const mockSupabase = {
    from: jest.fn(),
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
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

    mockSupabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({ error: null }),
      }),
    });

    const result = await updateTaskById(mockTaskInput);

    expect(mockSupabase.from).toHaveBeenCalledWith("task");
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

    mockSupabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValueOnce({ error: { message: "Error" } }),
      }),
    });

    const result = await updateTaskById(mockTaskInput);

    expect(result).toBe(false);
  });
});
