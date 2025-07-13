import { deleteTaskById } from "./deleteTaskById";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe("deleteTaskById", () => {
  const mockSupabaseAuth = require("../../utils/supabase/component").supabase
    .auth;
  const mockSupabaseFrom = require("../../utils/supabase/component").supabase
    .from;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a task by ID", async () => {
    const mockUserId = "user123";
    const mockTaskId = "task123";

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    const mockEq = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    const mockDelete = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabaseFrom.mockReturnValue({
      delete: mockDelete,
    });

    await deleteTaskById(mockTaskId);

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
    expect(mockSupabaseFrom).toHaveBeenCalledWith("task");
  });

  it("should handle errors gracefully", async () => {
    const mockTaskId = "task123";

    mockSupabaseAuth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: "user123" } } },
    });

    const mockEq = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValueOnce({ error: { message: "Error" } }),
    });

    const mockDelete = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabaseFrom.mockReturnValue({
      delete: mockDelete,
    });

    await deleteTaskById(mockTaskId);

    expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
  });
});
