import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { v4 as uuid } from "uuid";

/**
 * Upload a profile picture to Supabase storage
 * @param file - The image file to upload
 * @param userId - The user ID for the folder structure
 * @returns The public URL of the uploaded image
 */
export async function uploadProfilePicture(
  file: File,
  userId: string
): Promise<string | null> {
  const result = await apiWrapper(
    async () => {
      // Generate a unique filename
      const filePath = `${userId}/${uuid()}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);

      console.log(urlData, "from upload new pic");

      return { data: urlData.publicUrl, error: null };
    },
    {
      showErrorToast: true,
      errorMessage:
        GENERIC_ERROR_MESSAGES.UPLOAD_FAILED ||
        "Failed to upload profile picture",
      logErrors: true,
    }
  );

  return result.success ? result.data || null : null;
}

/**
 * Delete a profile picture from Supabase storage
 * @param profilePictureUrl - The public URL of the image to delete
 * @returns boolean indicating success
 */
export async function deleteProfilePicture(
  profilePictureUrl: string
): Promise<boolean> {
  const result = await apiWrapper(
    async () => {
      // Extract file path from public URL
      const url = new URL(profilePictureUrl);
      const pathSegments = url.pathname.split("/");
      const filePath = pathSegments.slice(-2).join("/"); // Get "userId/filename.ext"
      console.log(filePath, "fron delete pic");

      const { error } = await supabase.storage
        .from("profile-photos")
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return { data: true, error: null };
    },
    {
      showErrorToast: false,
      errorMessage: "Failed to delete old profile picture",
      logErrors: true,
    }
  );

  return result.success;
}

/**
 * Update the user's profile picture URL in the database
 * @param newProfilePictureUrl - The new profile picture URL
 * @returns boolean indicating success
 */
export async function updateUserProfilePicture(
  newProfilePictureUrl: string
): Promise<boolean> {
  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session found");
      }

      console.log(newProfilePictureUrl, "new url from update url");
      const { error } = await supabase
        .from("users")
        .update({ profile_picture: newProfilePictureUrl })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      return { data: true, error: null };
    },
    {
      showErrorToast: true,
      errorMessage:
        GENERIC_ERROR_MESSAGES.DATABASE_ERROR ||
        "Failed to update profile picture",
      logErrors: true,
    }
  );

  return result.success;
}
