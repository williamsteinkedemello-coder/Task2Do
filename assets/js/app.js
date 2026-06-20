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
    tasks = updatedTasks.map(task => ({ ...task, isEditing: false }));
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

  function renderTasks() {
    taskListEl.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      const iconsWrapper = document.createElement("div");
      iconsWrapper.className = "taskIcons";
      iconsWrapper.dataset.id = task.id; // store unique id in dataset

      // Check if the current task is in editing state
      if (task.isEditing) {
        li.className = "editing";

        // Create edit input field
        const inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.className = "editInput";
        inputEl.value = task.text;
        li.appendChild(inputEl);

        // Autofocus the input field
        setTimeout(() => inputEl.focus(), 0);

        // Save button (checkmark icon)
        const saveBtn = document.createElement("span");
        saveBtn.className = "saveBtn material-icons";
        saveBtn.textContent = "check";

        // Cancel button (close icon)
        const cancelBtn = document.createElement("span");
        cancelBtn.className = "cancelBtn material-icons";
        cancelBtn.textContent = "close";

        iconsWrapper.appendChild(saveBtn);
        iconsWrapper.appendChild(cancelBtn);

        // Also allow saving with Enter or cancelling with Escape
        inputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const newText = inputEl.value.trim();
            if (newText) {
              const updated = tasks.map(t => t.id === task.id ? { ...t, text: newText } : t);
              updateTasksState(updated);
            }
          } else if (e.key === "Escape") {
            tasks = tasks.map(t => t.id === task.id ? { ...t, isEditing: false } : t);
            renderTasks();
          }
        });

      } else {
        // Normal View Mode
        li.textContent = task.text;

        // Edit icon
        const editBtn = document.createElement("span");
        editBtn.className = "editBtn material-icons";
        editBtn.textContent = "edit";

        // Delete button icon
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "deleteBtn material-icons";
        deleteBtn.textContent = "close";

        iconsWrapper.appendChild(editBtn);
        iconsWrapper.appendChild(deleteBtn);
      }

      li.appendChild(iconsWrapper);
      taskListEl.append(li);
    });
  }

  function renderTasksViewMode() {
    
  }

  function editTask(e) {
    if (!e.target.classList.contains("editBtn")) return;

    const taskId = Number(e.target.parentElement.dataset.id);

    // Set isEditing to true for the selected task, and false for all others
    tasks = tasks.map((task) => 
      task.id === taskId ? { ...task, isEditing: true } : { ...task, isEditing: false }
    );
    renderTasks();
  }

  function saveTask(e) {
    if (!e.target.classList.contains("saveBtn")) return;

    const taskId = Number(e.target.parentElement.dataset.id);
    const li = e.target.closest("li");
    const inputEl = li.querySelector(".editInput");
    const newText = inputEl.value.trim();

    if (!newText) return;

    const updatedTasks = tasks.map((task) => 
      task.id === taskId ? { ...task, text: newText } : task
    );
    
    updateTasksState(updatedTasks);
  }

  function cancelEdit(e) {
    if (!e.target.classList.contains("cancelBtn")) return;

    // Reset editing states and re-render
    tasks = tasks.map((task) => ({ ...task, isEditing: false }));
    renderTasks();
  }

  function deleteTask(e) {
    if (!e.target.classList.contains("deleteBtn")) return;
  
    const taskId = Number(e.target.parentElement.dataset.id);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    
    updateTasksState(updatedTasks);
  }
});