import { TaskProps } from "./Task.types";

export type StatusColumnProps = {
    id: number;
    title: string;
    status: string;
    updatedAt: Date;
    tasks: TaskProps[];
}