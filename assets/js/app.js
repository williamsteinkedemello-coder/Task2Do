document.addEventListener("DOMContentLoaded", () => {
    // DOM Element Selectors
    const taskInputEl = document.querySelector(".taskInput");
    const taskBtnEl = document.querySelector(".taskCreateBtn");
    const taskListEl = document.querySelector(".taskList");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
});