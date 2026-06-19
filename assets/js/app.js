document.addEventListener("DOMContentLoaded", () => {
    // DOM Element Selectors
    const taskInputEl = document.querySelector(".taskInput");
    const taskBtnEl = document.querySelector(".taskCreateBtn");
    const taskListEl = document.querySelector(".taskList");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Event Listeners
    taskBtnEl.addEventListener("click", addNewTask);
    taskListEl.addEventListener("click", deleteTask);
    taskListEl.addEventListener("click", editTask);
    taskListEl.addEventListener("click", saveTask);     // Added for save
    taskListEl.addEventListener("click", cancelEdit);   // Added for cancel

    // Initial render when the DOM loads
    renderTasks();

});