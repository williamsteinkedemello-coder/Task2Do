export const images = [
    "./assets/hero-background1.png",
    "./assets/hero-background2.png",
    "./assets/hero-background3.png"
];

export const createEmptyStateParagraph = (taskListEl) => {
    const emptyStateParagraph = document.createElement("p");
    emptyStateParagraph.className = "emptyState";
    emptyStateParagraph.textContent = "No tasks found. Create a task to get started!";
    taskListEl.appendChild(emptyStateParagraph);
}
