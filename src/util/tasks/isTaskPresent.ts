import { DTaskProps } from "../../components/board/DTask.types";

export default function isTaskPresent(task: DTaskProps, taskList: DTaskProps[]) {
    const searchTask = taskList.find((item) => item.id === task.id);

    if (searchTask !== undefined) {
        return true;
    }

    else {
        return false;
    }
}