import { UserAccountProps } from "../account/UserAccount";

export type TaskProps = {
    id: number;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userAccount: UserAccountProps;
    columnId: number;
}

export type TaskInput = {
    description?: string;
    dueDate?: Date;
    priority?: string;
    status?: string;
    createdAt?: Date;
    userAccount?: UserAccountProps;
    columnId?: number;
}