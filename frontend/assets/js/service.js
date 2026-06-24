export async function getTasksFromDatabase() {
    try {
        console.log("Fetching tasks from database...");
        const res = await fetch("/tasks");
        console.log("Tasks fetched successfully", res)
        const tasks = await res.json();
        return tasks;
    } catch (err) {
        console.error("Failed to get tasks:", err);
        throw err;
    }
}

export async function saveTasksToDatabase(task) {
    try {
        const res = await fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        console.log("Task saved successfully", res);
        const taskRetrieved = await res.json();
        return taskRetrieved;
    } catch (err) {
        console.error("Failed to save task:", err);
        throw err;
    }
}



export async function updateTaskOnDatabase(task) {
    try {
        const res = await fetch(`/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
        console.log("Task updated successfully", res);

    } catch (err) {
        console.error("Failed to update task:", err);
        throw err;
    }
}


export async function deleteTaskFromDatabase(tasks, taskId) {
    try {
        const res = await fetch(`/tasks/${taskId}`, {
            method: "DELETE",
        });

        const updatedTasks = tasks.filter((task) => task.id !== taskId);

        return updatedTasks;
    } catch (err) {
        console.error("Failed to delete task:", err);
        throw err;
    }

}
