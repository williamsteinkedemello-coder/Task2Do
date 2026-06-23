export const images = [
    "./assets/hero-background1.png",
    "./assets/hero-background2.png",
    "./assets/hero-background3.png"
];

export const handleTasksUpdate = (taskListEl, message = "No tasks found. Create a task to get started!") => {
    const emptyStateParagraph = document.createElement("p");
    emptyStateParagraph.className = "emptyState";
    emptyStateParagraph.textContent = message;
    taskListEl.appendChild(emptyStateParagraph);
}

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
        console.log("Task updated successfully", res)

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

export function findTaskByIdOnElementClick(clickedElement, tasks) {
    const liElement = clickedElement.tagName === "LI" ? clickedElement : clickedElement.closest("li");
    const taskClicked = tasks.find((task) => task.id === Number(liElement.dataset.id));
    return { taskClicked, liElement };
}


