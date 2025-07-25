import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePictureModal from "./ProfilePictureModal";

// Mock the auth context
jest.mock("../../context", () => ({
  useAuth: () => ({
    personalInfo: {
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      profilePictureUrl: "https://example.com/profile.jpg",
    },
    invalidateCache: jest.fn(),
  }),
}));

// Mock the API functions
jest.mock("../../api/user/profilePicture", () => ({
  uploadProfilePicture: jest.fn(),
  deleteProfilePicture: jest.fn(),
  updateUserProfilePicture: jest.fn(),
}));

// Mock the toast notification
jest.mock("../notifications/CustomToast", () => ({
  showToast: jest.fn(),
}));

describe("ProfilePictureModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    currentProfilePictureUrl: "https://example.com/current-profile.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    expect(screen.getByText("Update Profile Picture")).toBeInTheDocument();
    expect(screen.getByText("Choose Photo")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Update Photo")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<ProfilePictureModal {...defaultProps} isOpen={false} />);

    expect(
      screen.queryByText("Update Profile Picture")
    ).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = jest.fn();
    render(<ProfilePictureModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when close X button is clicked", () => {
    const onClose = jest.fn();
    render(<ProfilePictureModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalled();
  });

  it("displays current profile picture", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    const profileImage = screen.getByAltText("Profile preview");
    expect(profileImage).toHaveAttribute(
      "src",
      "https://example.com/current-profile.jpg"
    );
  });

  it("disables update button when no file is selected", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    const updateButton = screen.getByText("Update Photo");
    expect(updateButton.closest("button")).toBeDisabled();
  });

  it("shows file validation message", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    expect(
      screen.getByText("JPEG, JPG, PNG, or WebP (max 5MB)")
    ).toBeInTheDocument();
  });
});
