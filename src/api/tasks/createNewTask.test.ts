import { createNewTask } from "./createNewTask";
import { createClient } from "../../utils/supabase/component";
import { TaskInput } from "../../models/board/Task";

jest.mock("../../utils/supabase/component", () => ({
  createClient: jest.fn(),
}));

describe("createNewTask", () => {
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

  it("should successfully create a new task", async () => {
    const mockUserId = "user123";
    const mockTaskInput: TaskInput = {
      description: "Test task",
      dueDate: new Date(),
      dueTime: "12:00",
      priority: "High",
      columnId: 1,
      id: "task1",
      projectId: "id",
    };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValueOnce({ error: null }),
      }),
    });

    const result = await createNewTask(mockTaskInput);

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("task");
    expect(result).toBe(true);
  });

  it("should return false if an error occurs", async () => {
    const mockTaskInput: TaskInput = {
      description: "Test task",
      dueDate: new Date(),
      dueTime: "12:00",
      priority: "High",
      columnId: 1,
      id: "task1",
      projectId: "id",
    };

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: "user123" } } },
    });

    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockResolvedValueOnce({ error: { message: "Error" } }),
      }),
    });

    const result = await createNewTask(mockTaskInput);

    expect(result).toBe(false);
  });
});
