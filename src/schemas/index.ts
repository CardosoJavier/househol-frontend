// Re-export schemas with explicit naming to avoid conflicts
export {
  signUpSchema as authSignUpSchema,
  signInSchema,
  emailSchema,
  nameSchema,
  type SignUpInput,
  type SignInInput,
} from "./auth";
export {
  profilePictureSchema,
  type ProfilePictureInput,
} from "./profilePicture";
export {
  createTaskSchema,
  updateTaskSchema,
  taskPrioritySchema,
  taskStatusSchema,
  taskDescriptionSchema,
  taskUuidSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "./tasks";
export {
  createProjectSchema,
  updateProjectSchema,
  projectNameSchema,
  projectUuidSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "./projects";
export {
  createColumnSchema,
  updateColumnSchema,
  columnTitleSchema,
  columnStatusSchema,
  columnUuidSchema,
  type CreateColumnInput,
  type UpdateColumnInput,
} from "./columns";
export {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "./user";
export {
  addProjectMemberSchema,
  type AddProjectMemberInput,
} from "./projectMembers";
