import { deleteProjectById } from "./deleteProjectById";
import { dbOperationWrapper } from "../apiWrapper";

// Mock the dependencies
jest.mock("../apiWrapper");
jest.mock("../../components/notifications/CustomToast");
jest.mock("../../config", () => ({
  VITE_SUPABASE_URL: "https://mock-supabase-url.supabase.co",
  VITE_SUPABASE_ANON_KEY: "mock-anon-key",
}));

const mockDbOperationWrapper = dbOperationWrapper as jest.MockedFunction<
  typeof dbOperationWrapper
>;

describe("deleteProjectById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock to return success
    mockDbOperationWrapper.mockResolvedValue(true);
  });

  it("should successfully delete a project by ID", async () => {
    const mockProjectId = "test-project-id";

    const result = await deleteProjectById(mockProjectId);

    expect(mockDbOperationWrapper).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should handle errors gracefully", async () => {
    const mockProjectId = "invalid-id";

    // Mock dbOperationWrapper to simulate an error
    mockDbOperationWrapper.mockResolvedValueOnce(false);

    const result = await deleteProjectById(mockProjectId);

    expect(result).toBe(false);
  });

  it("should pass the correct operation to dbOperationWrapper", async () => {
    const mockProjectId = "test-project-id";

    await deleteProjectById(mockProjectId);

    expect(mockDbOperationWrapper).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        successMessage: "Project deleted successfully!",
        showSuccessToast: true,
        showErrorToast: true,
      })
    );
  });
});
