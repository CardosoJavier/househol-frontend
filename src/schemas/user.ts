import { z } from "zod";
import { nameSchema, emailSchema } from "./auth";

// Profile picture URL validation
export const profilePictureUrlSchema = z
  .string()
  .url("Invalid profile picture URL")
  .max(500, "Profile picture URL cannot exceed 500 characters")
  .refine((url) => {
    // Validate that it's an image URL
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const urlLower = url.toLowerCase();
    return (
      imageExtensions.some((ext) => urlLower.includes(ext)) ||
      urlLower.includes("imgur.com") ||
      urlLower.includes("cloudinary.com") ||
      urlLower.includes("amazonaws.com")
    );
  }, "URL must be a valid image URL")
  .optional();

// User profile update schema
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  profilePictureUrl: profilePictureUrlSchema,
});

// Password change schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password cannot exceed 128 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain at least one special character"
      )
      .refine((password) => {
        const commonPatterns = ["password", "123456", "qwerty", "admin"];
        return !commonPatterns.some((pattern) =>
          password.toLowerCase().includes(pattern)
        );
      }, "New password contains common patterns and is not secure"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
