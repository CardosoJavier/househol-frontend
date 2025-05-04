import { deleteTaskById } from "./deleteTaskById";
import { createClient } from "../../utils/supabase/component";

jest.mock("../../utils/supabase/component", () => ({
  createClient: jest.fn(),
}));

describe("deleteTaskById", () => {
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

  it("should successfully delete a task by ID", async () => {
    const mockUserId = "user123";
    const mockTaskId = "task123";

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: mockUserId } } },
    });

    mockSupabase.from.mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValueOnce({ error: null }),
        }),
      }),
    });

    await deleteTaskById(mockTaskId);

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith("task");
  });

  it("should handle errors gracefully", async () => {
    const mockTaskId = "task123";

    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: "user123" } } },
    });

    mockSupabase.from.mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValueOnce({ error: { message: "Error" } }),
        }),
      }),
    });

    await deleteTaskById(mockTaskId);

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
  });
});