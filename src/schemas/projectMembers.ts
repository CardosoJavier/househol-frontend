import { z } from "zod";
import { emailSchema } from "./auth";
import { projectUuidSchema } from "./projects";

// Add member to project schema
export const addProjectMemberSchema = z.object({
  projectId: projectUuidSchema,
  email: emailSchema,
});

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
