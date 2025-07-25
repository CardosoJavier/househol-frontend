import { useState, useRef, ChangeEvent } from "react";
import { profilePictureSchema } from "../../schemas/profilePicture";
import {
  uploadProfilePicture,
  deleteProfilePicture,
  updateUserProfilePicture,
} from "../../api/user/profilePicture";
import { useAuth } from "../../context";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_SUCCESS_MESSAGES } from "../../constants";
import CustomButton from "../input/customButton";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfilePictureUrl?: string;
}

export default function ProfilePictureModal({
  isOpen,
  onClose,
  currentProfilePictureUrl,
}: ProfilePictureModalProps) {
  const { personalInfo, refreshPersonalInfo } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file using schema
    const validation = profilePictureSchema.safeParse({ file });
    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Invalid file";
      showToast(errorMessage, "error");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !personalInfo) return;

    setIsUploading(true);
    try {
      // Step 1: Upload new profile picture
      const newProfilePictureUrl = await uploadProfilePicture(
        selectedFile,
        personalInfo.id
      );

      if (!newProfilePictureUrl) {
        showToast("Failed to upload profile picture", "error");
        return;
      }

      // Step 2: Update database with new URL
      const updateSuccess = await updateUserProfilePicture(
        newProfilePictureUrl
      );

      if (!updateSuccess) {
        // If database update fails, clean up the uploaded file
        await deleteProfilePicture(newProfilePictureUrl);
        showToast("Failed to update profile picture", "error");
        return;
      }

      // Step 3: Delete old profile picture (if it exists and is different)
      if (
        currentProfilePictureUrl &&
        currentProfilePictureUrl !== newProfilePictureUrl
      ) {
        await deleteProfilePicture(currentProfilePictureUrl);
      }

      // Step 4: Refresh user data and show success
      await refreshPersonalInfo();
      showToast(
        GENERIC_SUCCESS_MESSAGES.PROFILE_UPDATED ||
          "Profile picture updated successfully!",
        "success"
      );

      // Close modal and reset state
      handleClose();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Profile Picture</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Current/Preview Image */}
          <div className="flex justify-center">
            <img
              src={
                previewUrl || currentProfilePictureUrl || "/default-avatar.png"
              }
              alt="Profile preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <CustomButton
              type="button"
              label="Choose Photo"
              onClick={handleFileInputClick}
              isDisabled={isUploading}
            />
            <p className="text-sm text-gray-500 text-center">
              JPEG, JPG, PNG, or WebP (max 5MB)
            </p>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">
                Selected: {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <CustomButton
              type="button"
              label="Cancel"
              onClick={handleClose}
              isDisabled={isUploading}
            />
            <CustomButton
              type="button"
              label={isUploading ? "Uploading..." : "Update"}
              onClick={handleUpload}
              isDisabled={!selectedFile || isUploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
