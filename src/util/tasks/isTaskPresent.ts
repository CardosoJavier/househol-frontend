import { TaskProps } from "../../components/board/Task.types";

export default function isTaskPresent(task: TaskProps, taskList: TaskProps[]) {
    const searchTask = taskList.find((item) => item.id === task.id);

    if (searchTask !== undefined) {
        return true;
    }

    else {
        return false;
    }
}