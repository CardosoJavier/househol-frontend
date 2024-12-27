import DTaskProps from "./DTicket.types";

export default interface DColumnProps {
    id: number;
    title: String;
    tasks: DTaskProps[];
}