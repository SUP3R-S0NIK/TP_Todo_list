class TaskList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
        * {
        color: white;
        margin: 0;
        box-sizing: border-box;
      }
      body {
        background-color: rgb(23, 161, 161);
      }
      input {
        color: rgb(51, 50, 50);
      }
      h1 {
        margin-top: 20px;
        text-align: center;
        margin-bottom: 20px;
      }
      #add {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        gap: 10px;
        font-size: 1.3rem;
      }
      label {
        font-size: 1.5rem;
      }
      #add-task {
        background-color: rgb(51, 50, 50);
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 1.2rem;
        text-align: center;
        border: 0;
        color: white;
      }
      #button-end {
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        width: 100vw;
      }
      button {
        background-color: rgb(0 0 0 / 0%);
        border:0;
        color: white;
      }
      svg {
        color:white;
        width:22px;
      }
      #button-end > button {
        width: 100%;
        height: 80px;
        font-size: 1.5rem;
      }
      #task-list {
        margin-top: 20px;
      }
      .case {
        height: 25px;
        width: 25px;
      }
      .task {
        height: fit-content;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2fr repeat(2, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        margin-bottom:20px;
        margin-left:10px;
      }

      #task-list {
     width: 100%
      }
      .case:checked ~ label {
        text-decoration: line-through;
      }
        </style>
        <div id="task-list"></div>
      `;
  }

  connectedCallback() {
    const taskList = this.shadowRoot.getElementById("task-list");
    const taskInput = document.getElementById("task");
    const addTaskButton = document.getElementById("add-task");
    const clearCompletedButton = document.getElementById("button-end");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
      taskList.innerHTML = "";
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const taskElement = document.createElement("section");
        taskElement.classList.add("task");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "case";
        checkbox.checked = task.completed;
        checkbox.id = task.name;
        checkbox.addEventListener("change", () => {
          task.completed = checkbox.checked;
          saveTasks();
        });

        const label = document.createElement("label");
        label.textContent = task.name;
        label.htmlFor = task.name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "task-input";
        input.value = task.name;
        input.style.display = "none";

        const editButton = document.createElement("button");
        editButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#f5f5f5}</style><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>';
        editButton.addEventListener("click", () => {
          label.style.display = "none";
          input.style.display = "inline";
          editButton.style.display = "none";
          saveButton.style.display = "inline";
          input.focus();
        });

        const saveButton = document.createElement("button");
        saveButton.textContent = "Valider";
        saveButton.style.display = "none";
        saveButton.addEventListener("click", () => {
          const updatedTaskName = input.value;
          task.name = updatedTaskName;
          saveTasks();
          renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
        deleteButton.addEventListener("click", () => {
          tasks.splice(i, 1);
          saveTasks();
          renderTasks();
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(input);
        taskElement.appendChild(editButton);
        taskElement.appendChild(saveButton);
        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
      }
    }

    addTaskButton.addEventListener("click", () => {
      const taskName = taskInput.value.trim();
      if (taskName === "") return;

      tasks.push({ name: taskName, completed: false });
      saveTasks();
      taskInput.value = "";
      renderTasks();
    });

    clearCompletedButton.addEventListener("click", () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    renderTasks();
  }
}

customElements.define("task-list", TaskList);
