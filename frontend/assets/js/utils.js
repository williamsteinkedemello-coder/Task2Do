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


export function findTaskByIdOnElementClick(clickedElement, tasks) {
    const liElement = clickedElement.tagName === "LI" ? clickedElement : clickedElement.closest("li");
    const taskClicked = tasks.find((task) => task.id === Number(liElement.dataset.id));
    return { taskClicked, liElement };
}


