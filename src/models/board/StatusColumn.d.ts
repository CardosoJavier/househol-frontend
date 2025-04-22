import { TaskProps } from "./Task";

export type StatusColumnProps = {
    id: number;
    title: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
    task: TaskProps[];
}