import { UserAccountProps } from "../account/UserAccount";

export type TaskProps = {
  id: string;
  description: string;
  dueDate: Date;
  priority: string;
  type?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userAccount: UserAccountProps;
  columnId: number;
  projectId: string;
};

export type TaskInput = {
  id?: string;
  description?: string;
  dueDate?: Date | string; // API might return string format
  priority?: string;
  type?: string;
  status?: string;
  createdAt?: Date;
  userAccount?: UserAccountProps;
  columnId?: number;
  projectId: string;
};
