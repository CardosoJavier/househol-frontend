import {DTaskProps} from "./DTask.types";

export type DColumnProps = {
    id: number;
    title: string;
    tasks: DTaskProps[];
}