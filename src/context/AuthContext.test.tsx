import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Mock the API and utilities
jest.mock("../api", () => ({
  getPersonalInfo: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("../utils", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
  isSuccessfulSignInResponse: jest.fn(),
}));

jest.mock("react-router", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../components/notifications/CustomToast", () => ({
  showToast: jest.fn(),
}));

describe("AuthContext refreshPersonalInfo", () => {
  const { getPersonalInfo } = require("../api");
  const { supabase } = require("../utils");

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock session
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: "test-user-id" } } },
    });
  });

  it("should refresh personal info and update state", async () => {
    const mockPersonalInfo = {
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      profilePictureUrl: "https://example.com/new-profile.jpg",
    };

    getPersonalInfo.mockResolvedValue(mockPersonalInfo);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Update the mock to return new profile picture URL
    const updatedPersonalInfo = {
      ...mockPersonalInfo,
      profilePictureUrl: "https://example.com/updated-profile.jpg",
    };
    getPersonalInfo.mockResolvedValue(updatedPersonalInfo);

    // Call refreshPersonalInfo
    await act(async () => {
      await result.current.refreshPersonalInfo();
    });

    // Verify that personal info was updated
    expect(result.current.personalInfo?.profilePictureUrl).toBe(
      "https://example.com/updated-profile.jpg"
    );
    expect(getPersonalInfo).toHaveBeenCalledTimes(2); // Initial + refresh
  });
});
