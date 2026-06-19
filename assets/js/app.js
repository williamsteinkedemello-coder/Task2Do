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

    // Updates the tasks state by persisting it to localStorage, and triggers a re-render
    function updateTasksState(updatedTasks) {
        // Before saving to localStorage, make sure no task is saved in editing mode
        tasks = updatedTasks;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function addNewTask(event) {
        event.preventDefault();
        const inputText = taskInputEl.value.trim();

        if (!inputText) return;

        const newlyCreatedTask = { id: Date.now(), text: inputText };

        // updateTasksState automatically calls renderTasks()
        updateTasksState([...tasks, newlyCreatedTask]);

        taskInputEl.value = ""; // reset input text
    }


});