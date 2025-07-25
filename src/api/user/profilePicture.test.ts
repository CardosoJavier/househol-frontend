import {
  uploadProfilePicture,
  updateUserProfilePicture,
} from "./profilePicture";

jest.mock("../../utils/supabase/component", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      update: jest.fn(),
      eq: jest.fn(),
    })),
  },
}));

describe("Profile Picture API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadProfilePicture", () => {
    it("should upload file and return public URL", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const userId = "test-user-id";
      const expectedUrl =
        "https://example.com/storage/profile-pictures/test-user-id/uuid.jpg";

      // Mock storage operations
      const mockUpload = jest.fn().mockResolvedValue({ error: null });
      const mockGetPublicUrl = jest
        .fn()
        .mockReturnValue({ data: { publicUrl: expectedUrl } });

      const { supabase } = require("../../utils/supabase/component");
      (supabase.storage.from as any).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      });

      const result = await uploadProfilePicture(mockFile, userId);

      expect(mockUpload).toHaveBeenCalled();
      expect(mockGetPublicUrl).toHaveBeenCalled();
      expect(result).toBe(expectedUrl);
    });
  });

  describe("updateUserProfilePicture", () => {
    it("should update user profile picture URL in database", async () => {
      const newUrl = "https://example.com/new-profile-pic.jpg";
      const userId = "test-user-id";

      // Mock database update
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const { supabase } = require("../../utils/supabase/component");
      (supabase.from as any).mockReturnValue({
        update: mockUpdate,
      });

      // Mock session
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: { user: { id: userId } } },
      });

      const result = await updateUserProfilePicture(newUrl);

      expect(mockUpdate).toHaveBeenCalledWith({ profile_picture: newUrl });
      expect(result).toBe(true);
    });
  });
});
