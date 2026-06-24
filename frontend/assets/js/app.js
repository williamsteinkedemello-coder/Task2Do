import {
  handleTasksUpdate,
  findTaskByIdOnElementClick
} from "./utils.js";

import {
  saveTasksToDatabase,
  getTasksFromDatabase,
  deleteTaskFromDatabase,
  updateTaskOnDatabase,
} from "./service.js";

// This code runs when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // DOM Element Selectors
  const taskInputEl = document.querySelector(".taskInput");
  const taskBtnEl = document.querySelector(".taskCreateBtn");
  const taskListEl = document.querySelector(".taskList");


  // Event Listeners
  taskBtnEl.addEventListener("click", addNewTask);
  taskListEl.addEventListener("click", handleTaskAction);

  let tasks = [];

  // Fetch tasks from database on load
  getTasksFromDatabase().then(fetchedTasks => {
    console.log("tasks from db: ", fetchedTasks);
    tasks = fetchedTasks || [];
    renderTasks()
  });

  // Initial render when the DOM loads
  renderTasks();

  // Update the tasks state and triggers a re-render
  function setTasks(updatedTasks) {
    tasks = updatedTasks;
    renderTasks();
  }

  async function addNewTask(event) {
    event.preventDefault();
    const inputText = taskInputEl.value.trim(); //get input text

    if (!inputText) return; //if input text is empty, return


    try {
      const taskToBeSent = { text: inputText, isEditing: false, completed: false };
      const taskRetrieved = await saveTasksToDatabase(taskToBeSent);
      setTasks([...tasks, taskRetrieved]);
      taskInputEl.value = "";
    } catch (err) {
      handleTasksUpdate(taskListEl, "Failed to save tasks. Please try again.");
    }

  }

  function renderTasks() {
    taskListEl.innerHTML = "";

    if (tasks.length === 0) {
      handleTasksUpdate(taskListEl)
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
        taskListEl.addEventListener("keydown", handleEditInputKeydown);

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

  function handleEditInputKeydown(e) {
    //if the event is not triggered by an edit input, return
    if (!e.target.classList.contains("editInput")) {
      return;
    }
    const { taskClicked } = findTaskByIdOnElementClick(e.target, tasks);

    //if the event is triggered by an enter key in the edit input
    if (e.key === "Enter") {
      const newText = e.target.value.trim();
      if (newText) {
        const taskToUpdate = { ...taskClicked, text: newText, isEditing: false };
        const updated = tasks.map(task => task.id === taskClicked.id ? taskToUpdate : task);
        updateTaskOnDatabase(taskToUpdate);
        setTasks(updated);

      }
      //if the event is triggered by an escape key in the edit input
    } else if (e.key === "Escape") {
      const taskToUpdate = { ...taskClicked, isEditing: false };
      const updatedTasks = tasks.map(task => task.id === taskClicked.id ? taskToUpdate : task);
      setTasks(updatedTasks);
    }
  }


  async function handleTaskAction(e) {
    const clickedElement = e.target;
    const { taskClicked, liElement } = findTaskByIdOnElementClick(clickedElement, tasks);
    const clickedBtnClassList = clickedElement.classList;

    if (clickedBtnClassList.contains("editBtn")) {
      if (taskClicked?.completed) {
        console.log("Completed tasks cannot be edited.");
        return;
      }

      editTask(clickedElement);
    } else if (clickedBtnClassList.contains("deleteBtn")) {
      const taskId = Number(clickedElement.parentElement.dataset.id);
      const updatedTasks = await deleteTaskFromDatabase(tasks, taskId);
      setTasks(updatedTasks);

    } else if (clickedBtnClassList.contains("saveBtn")) {
      saveTask(clickedElement);
    } else if (clickedBtnClassList.contains("cancelBtn")) {
      cancelEdit();
    } else if (!liElement.classList.contains("editing")) {
      completeTask(clickedElement);
    }
  }

  async function completeTask(clickedElement) {
    const { taskClicked } =
      findTaskByIdOnElementClick(clickedElement, tasks);

    const updatedTask = {
      ...taskClicked,
      completed: Boolean(!taskClicked.completed),
    };

    await updateTaskOnDatabase(updatedTask);

    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id
        ? updatedTask
        : task
    );

    setTasks(updatedTasks);
  }

  function editTask(clickedElement) {
    const { taskClicked } = findTaskByIdOnElementClick(clickedElement, tasks);
    // Set isEditing to true for the selected task, and false for all others
    const updatedTasks = tasks.map((task) => task.id === taskClicked.id ? { ...task, isEditing: true } : { ...task, isEditing: false });
    setTasks(updatedTasks);
  }

  async function saveTask(saveBtn) {
    let { taskClicked, liElement } = findTaskByIdOnElementClick(saveBtn, tasks);
    const inputEl = liElement.querySelector(".editInput"); //get the input element
    const newText = inputEl.value.trim(); //get the input value

    if (!newText) return; //if input value is empty, return

    taskClicked = { ...taskClicked, text: newText, isEditing: false };
    tasks = tasks.map((task) => task.id === taskClicked.id ? taskClicked : task);
    await updateTaskOnDatabase(taskClicked);

    setTasks(tasks);
  }

  function cancelEdit() {
    // Reset editing states and re-render
    tasks = tasks.map((task) => ({ ...task, isEditing: false }));
    renderTasks();
  }


});

