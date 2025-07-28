import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProfilePictureModal from "./ProfilePictureModal";
import {
  uploadProfilePicture,
  deleteProfilePicture,
  updateUserProfilePicture,
} from "../../api/user/profilePicture";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_SUCCESS_MESSAGES } from "../../constants";

// Mock the auth context
const mockRefreshPersonalInfo = jest.fn();
jest.mock("../../context", () => ({
  useAuth: () => ({
    personalInfo: {
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      profilePictureUrl: "https://example.com/profile.jpg",
    },
    refreshPersonalInfo: mockRefreshPersonalInfo,
  }),
}));

// Mock the API functions and schema validation
jest.mock("../../api/user/profilePicture", () => ({
  uploadProfilePicture: jest.fn(),
  deleteProfilePicture: jest.fn(),
  updateUserProfilePicture: jest.fn(),
}));

jest.mock("../../schemas/profilePicture", () => ({
  profilePictureSchema: {
    safeParse: jest.fn().mockReturnValue({ success: true }),
  },
}));

// Mock the toast notification
jest.mock("../notifications/CustomToast", () => ({
  showToast: jest.fn(),
}));

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("ProfilePictureModal", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    currentProfilePictureUrl: "https://example.com/current-profile.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("File Upload Handling", () => {
    const originalFile = global.File;
    const originalFileReader = global.FileReader;

    beforeAll(() => {
      class MockFile extends File {
        constructor(
          parts: BlobPart[],
          filename: string,
          options: { type: string }
        ) {
          super(parts, filename, options);
          Object.defineProperty(this, "size", {
            value: 1024 * 1024, // 1MB
            writable: false,
          });
          Object.defineProperty(this, "lastModified", {
            value: Date.now(),
            writable: false,
          });
        }
      }

      global.File = MockFile as unknown as typeof File;

      const mockFileReader = function (this: any) {
        let readerResult: string | ArrayBuffer | null = null;
        let readerState: 0 | 1 | 2 = 0;

        Object.defineProperties(this, {
          result: {
            get: () => readerResult,
            set: (value: string | ArrayBuffer | null) => {
              readerResult = value;
            },
          },
          readyState: {
            get: () => readerState,
            set: (value: 0 | 1 | 2) => {
              readerState = value;
            },
          },
          EMPTY: { value: 0 },
          LOADING: { value: 1 },
          DONE: { value: 2 },
          error: { value: null, writable: true },
          onabort: { value: null, writable: true },
          onerror: { value: null, writable: true },
          onload: { value: null, writable: true },
          onloadend: { value: null, writable: true },
          onloadstart: { value: null, writable: true },
          onprogress: { value: null, writable: true },
        });

        this.abort = jest.fn();
        this.readAsArrayBuffer = jest.fn();
        this.readAsBinaryString = jest.fn();
        this.readAsText = jest.fn();
        this.addEventListener = jest.fn();
        this.removeEventListener = jest.fn();
        this.dispatchEvent = jest.fn().mockReturnValue(true);
        this.readAsDataURL = jest.fn(function () {
          setTimeout(() => {
            this.result = "data:image/jpeg;base64,mockbase64";
            this.readyState = this.DONE;
            if (this.onload) {
              const event = new ProgressEvent(
                "load"
              ) as ProgressEvent<FileReader>;
              Object.defineProperty(event, "target", { value: this });
              this.onload.call(this, event);
            }
          }, 0);
        });
      };

      global.FileReader = mockFileReader as unknown as typeof FileReader;
    });

    afterAll(() => {
      global.File = originalFile;
      global.FileReader = originalFileReader;
    });

    it("handles file selection correctly", async () => {
      render(<ProfilePictureModal {...defaultProps} />);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByTestId("file-input");
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText("Selected: test.jpg")).toBeInTheDocument();
        expect(screen.getByText("Size: 1.00 MB")).toBeInTheDocument();
      });
    });

    it("handles successful file upload", async () => {
      const newPictureUrl = "https://example.com/new-profile.jpg";
      (uploadProfilePicture as jest.Mock).mockResolvedValue(newPictureUrl);
      (updateUserProfilePicture as jest.Mock).mockResolvedValue(true);

      render(<ProfilePictureModal {...defaultProps} />);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByTestId("file-input");
      await user.upload(fileInput, file);

      const updateButton = screen.getByRole("button", { name: "Update" });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(uploadProfilePicture).toHaveBeenCalledWith(file, "test-user-id");
        expect(updateUserProfilePicture).toHaveBeenCalledWith(newPictureUrl);
        expect(deleteProfilePicture).toHaveBeenCalledWith(
          "https://example.com/current-profile.jpg"
        );
        expect(mockRefreshPersonalInfo).toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith(
          GENERIC_SUCCESS_MESSAGES.PROFILE_UPDATED ||
            "Profile picture updated successfully!",
          "success"
        );
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it("handles upload failure", async () => {
      (uploadProfilePicture as jest.Mock).mockResolvedValue(null);

      render(<ProfilePictureModal {...defaultProps} />);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByTestId("file-input");
      await user.upload(fileInput, file);

      const updateButton = screen.getByRole("button", { name: "Update" });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith(
          "Failed to upload profile picture",
          "error"
        );
        expect(updateUserProfilePicture).not.toHaveBeenCalled();
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      });
    });

    it("handles database update failure", async () => {
      const newPictureUrl = "https://example.com/new-profile.jpg";
      (uploadProfilePicture as jest.Mock).mockResolvedValue(newPictureUrl);
      (updateUserProfilePicture as jest.Mock).mockResolvedValue(false);

      render(<ProfilePictureModal {...defaultProps} />);

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByTestId("file-input");
      await user.upload(fileInput, file);

      const updateButton = screen.getByText("Update");
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(deleteProfilePicture).toHaveBeenCalledWith(newPictureUrl);
        expect(showToast).toHaveBeenCalledWith(
          "Failed to update profile picture",
          "error"
        );
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      });
    });

    it("handles unexpected errors during upload", async () => {
      const error = new Error("Network error");
      (uploadProfilePicture as jest.Mock).mockRejectedValue(error);

      render(<ProfilePictureModal {...defaultProps} />);

      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen.getByTestId("file-input");

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText("Selected: test.jpg")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
      });

      const updateButton = screen.getByRole("button", { name: "Update" });

      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith(
          "An unexpected error occurred",
          "error"
        );
        expect(defaultProps.onClose).not.toHaveBeenCalled();
      });
    });
  });

  it("renders modal when open", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    expect(screen.getByText("Update Profile Picture")).toBeInTheDocument();
    expect(screen.getByText("Choose Photo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
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

    const updateButton = screen.getByRole("button", { name: "Update" });
    expect(updateButton.closest("button")).toBeDisabled();
  });

  it("shows file validation message", () => {
    render(<ProfilePictureModal {...defaultProps} />);

    expect(
      screen.getByText("JPEG, JPG, PNG, or WebP (max 5MB)")
    ).toBeInTheDocument();
  });
});
