import { updateProjectById } from "./updateProjectById";
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

describe("updateProjectById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock to return success
    mockDbOperationWrapper.mockResolvedValue(true);
  });

  it("should successfully update a project by ID", async () => {
    const mockProjectData = {
      id: "test-project-id",
      name: "Updated Project Name",
    };

    const result = await updateProjectById(mockProjectData);

    expect(mockDbOperationWrapper).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should return false if the update fails", async () => {
    const mockProjectData = {
      id: "test-project-id",
      name: "Updated Project Name",
    };

    // Mock dbOperationWrapper to simulate a failure
    mockDbOperationWrapper.mockResolvedValueOnce(false);

    const result = await updateProjectById(mockProjectData);

    expect(result).toBe(false);
  });

  it("should pass the correct operation to dbOperationWrapper", async () => {
    const mockProjectData = {
      id: "test-project-id",
      name: "Updated Project Name",
    };

    await updateProjectById(mockProjectData);

    expect(mockDbOperationWrapper).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        successMessage: "Project updated successfully!",
        showSuccessToast: true,
        showErrorToast: true,
      })
    );
  });
});
