import { UserAccountProps } from "../account/UserAccount";

export type TaskProps = {
    id: string;
    description: string;
    dueDate: Date;
    dueTime: string
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userAccount: UserAccountProps; 
    columnId: number;
}

export type TaskInput = {
    id?: string;
    description?: string;
    dueDate?: Date;
    dueTime?: string;
    priority?: string;
    status?: string;
    createdAt?: Date;
    userAccount?: UserAccountProps;
    columnId?: number;
}