import { createNewTask } from "./createNewTask";
import { TaskInput } from "../../models/board/Task";

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

describe("createNewTask", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;
  const mockSupabaseFrom = require("../../utils/supabase/component").supabase
    .from;

  beforeEach(() => {
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

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    const mockSelect = jest.fn().mockResolvedValueOnce({ error: null });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
    mockSupabaseFrom.mockReturnValue({ insert: mockInsert });

    const result = await createNewTask(mockTaskInput);

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(mockSupabaseFrom).toHaveBeenCalledWith("task");
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

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: "user123" } } },
    });

    const mockSelect = jest
      .fn()
      .mockResolvedValueOnce({ error: { message: "Error" } });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
    mockSupabaseFrom.mockReturnValue({ insert: mockInsert });

    const result = await createNewTask(mockTaskInput);

    expect(result).toBe(false);
  });
});
