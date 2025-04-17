import { TaskProps } from "./Task";

export type StatusColumnProps = {
    id: number;
    title: string;
    status: string;
    updatedAt: Date;
    tasks: TaskProps[];
}