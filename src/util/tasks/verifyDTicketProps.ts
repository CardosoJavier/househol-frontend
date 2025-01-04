import {TaskProps} from "../../components/board/Task.types";

/*
* Takes an object as parameter, verifies its properties 
* and return a verification if the object is of type DTaskProps.
* 
* @param maybeTask: unknown - Potential object of type DTaskProps to be verifed
*/
export default function verifyDTaskProps(maybeTask: unknown) : TaskProps | undefined {
    
    if (typeof maybeTask === "object" &&
        maybeTask !== null &&
        "id" in maybeTask &&
        typeof (maybeTask as TaskProps).id === "number" &&
        "task" in maybeTask &&
        typeof (maybeTask as TaskProps).task === "string" &&
        "type" in maybeTask &&
        typeof (maybeTask as TaskProps).type === "string" &&
        "columnId" in maybeTask &&
        typeof (maybeTask as TaskProps).columnId === "number" ) {
            return maybeTask as TaskProps;
        }

        return undefined;

}