export const GENERIC_SUCCESS_MESSAGES = {
  // Authentication Success
  AUTH_SIGNIN_SUCCESS: "Welcome back! You have been signed in successfully.",
  AUTH_SIGNUP_SUCCESS:
    "Account created successfully! Please check your email for verification.",
  AUTH_EMAIL_VERIFIED: "Email verified successfully! You can now sign in.",
  AUTH_PASSWORD_RESET_SENT: "Password reset link has been sent to your email.",
  AUTH_PASSWORD_RESET_SUCCESS: "Password has been reset successfully.",
  AUTH_SIGNOUT_SUCCESS: "You have been signed out successfully.",

  // Task Management Success
  TASK_CREATED: "Task created successfully!",
  TASK_UPDATED: "Task updated successfully!",
  TASK_DELETED: "Task deleted successfully!",
  TASK_STATUS_CHANGED: "Task status updated successfully!",
  TASK_ASSIGNED: "Task assigned successfully!",
  TASK_MOVED: "Task moved successfully!",

  // Column Management Success
  COLUMN_CREATED: "Column created successfully!",
  COLUMN_UPDATED: "Column updated successfully!",
  COLUMN_DELETED: "Column deleted successfully!",
  COLUMN_REORDERED: "Columns reordered successfully!",

  // Project Management Success
  PROJECT_CREATED: "Project created successfully!",
  PROJECT_UPDATED: "Project updated successfully!",
  PROJECT_DELETED: "Project deleted successfully!",
  PROJECT_SHARED: "Project shared successfully!",
  PROJECT_ACCESS_GRANTED: "Project access granted successfully!",

  // User Profile Success
  PROFILE_UPDATED: "Profile updated successfully!",
  PROFILE_PICTURE_UPDATED: "Profile picture updated successfully!",
  EMAIL_UPDATED: "Email updated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",

  // Data Operations Success
  DATA_SAVED: "Changes saved successfully!",
  DATA_LOADED: "Data loaded successfully!",
  DATA_SYNCED: "Data synchronized successfully!",
  BACKUP_CREATED: "Backup created successfully!",
  DATA_EXPORTED: "Data exported successfully!",
  DATA_IMPORTED: "Data imported successfully!",

  // Sharing & Collaboration Success
  INVITATION_SENT: "Invitation sent successfully!",
  INVITATION_ACCEPTED: "Invitation accepted successfully!",
  MEMBER_ADDED: "Team member added successfully!",
  MEMBER_REMOVED: "Team member removed successfully!",
  PERMISSIONS_UPDATED: "Permissions updated successfully!",

  // General Success
  OPERATION_COMPLETED: "Operation completed successfully!",
  CHANGES_SAVED: "Your changes have been saved!",
  ACTION_COMPLETED: "Action completed successfully!",
} as const;

// Helper function to show success messages consistently
export function handleSuccess(message: string, duration: number = 3000): void {
  // This can be integrated with your toast notification system
  console.log("Success:", message);
  // You can replace this with your actual toast implementation
}
