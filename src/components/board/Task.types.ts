import { UserAccountProps } from "../account/UserAccount.types";

export type TaskProps = {
    id: number;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    createdAt: Date;
    userAccount: UserAccountProps;
    columnId: number;
}