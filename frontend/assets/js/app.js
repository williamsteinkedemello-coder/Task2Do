// This code runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM Element Selectors
  const taskInputEl = document.querySelector(".taskInput");
  const taskBtnEl = document.querySelector(".taskCreateBtn");
  const taskListEl = document.querySelector(".taskList");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Event Listeners
  taskBtnEl.addEventListener("click", addNewTask);
  taskListEl.addEventListener("click", handleTaskAction);


  // Initial render when the DOM loads
  renderTasks();

  // Updates the tasks state by persisting it to localStorage, and triggers a re-render
  function updateTasksState(updatedTasks) {
    // Before saving to localStorage, make sure no task is saved in editing mode
    tasks = updatedTasks.map(task => ({ ...task, isEditing: false }));
    localStorage.setItem("tasks", JSON.stringify(tasks)); //persist tasks to localStorage
    renderTasks(); // re-render the tasks
  }

  function addNewTask(event) {
    event.preventDefault();
    const inputText = taskInputEl.value.trim(); //get input text

    if (!inputText) return; //if input text is empty, return

    const newlyCreatedTask = { id: Date.now(), text: inputText, isEditing: false }; //create new task with unique id

    // updateTasksState automatically calls renderTasks()
    updateTasksState([...tasks, newlyCreatedTask]); // update tasks state with the new task

    taskInputEl.value = ""; // reset input text
  }

  function renderTasks() {
    taskListEl.innerHTML = "";

    if (tasks.length === 0) {
      const emptyStateParagraph = document.createElement("p");
      emptyStateParagraph.className = "emptyState";
      emptyStateParagraph.textContent = "No tasks found. Create a task to get started!";
      taskListEl.appendChild(emptyStateParagraph);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id; // store unique id in dataset
      const iconsWrapper = document.createElement("div");
      iconsWrapper.className = "taskIcons";
      iconsWrapper.dataset.id = task.id;

      // add completed class if task is completed
      if (task.completed) li.classList.add("completed");

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
        const textSpan = document.createElement("span");
        textSpan.className = "taskText";
        textSpan.textContent = task.text;
        li.appendChild(textSpan);

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


  function handleTaskAction(e) {
    const clickedBtnClassList = e.target.classList;
    const clickedElement = e.target;

    if (clickedBtnClassList.contains("editBtn")) {
      editTask(clickedElement);
    } else if (clickedBtnClassList.contains("deleteBtn")) {
      deleteTask(clickedElement);
    } else if (clickedBtnClassList.contains("saveBtn")) {
      saveTask(clickedElement);
    } else if (clickedBtnClassList.contains("cancelBtn")) {
      cancelEdit();
    } else {
      completeTask(clickedElement);
    }
  }

  function completeTask(clickedElement) {
    const liElement = clickedElement.tagName === "LI" ? clickedElement : clickedElement.closest("li");
    liElement.classList.toggle("completed");
    const taskId = Number(liElement.dataset.id);
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    updateTasksState(updatedTasks);
  }

  function editTask(editIconBtn) {
    const taskId = Number(editIconBtn.parentElement.dataset.id);
    // Set isEditing to true for the selected task, and false for all others
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isEditing: true } : { ...task, isEditing: false }
    );
    renderTasks();
  }

  function saveTask(saveBtn) {
    const taskId = Number(saveBtn.parentElement.dataset.id); //get id from the li element
    const li = saveBtn.closest("li"); //get the li element
    const inputEl = li.querySelector(".editInput"); //get the input element
    const newText = inputEl.value.trim(); //get the input value

    if (!newText) return; //if input value is empty, return

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    );

    updateTasksState(updatedTasks);
  }

  function cancelEdit() {
    // Reset editing states and re-render
    tasks = tasks.map((task) => ({ ...task, isEditing: false }));
    renderTasks();
  }

  function deleteTask(deleteIconBtn) {
    const taskId = Number(deleteIconBtn.parentElement.dataset.id);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    updateTasksState(updatedTasks);
  }
});