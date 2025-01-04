

export async function updateTaskById(taskId: number, taskInput: any) {

    const response = await fetch(`http://localhost:8080/api/v1/tasks/edit/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskInput)
    })

    if (!response.ok) {
        throw new Error("error updating task");
    }

    return await response.json();
}