console.log("APP RUNNING");

// DOM
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const taskCount = document.getElementById("taskCount");
const themeToggle = document.getElementById("themeToggle");

// State
let tasks = [];
let currentFilter = "all";

// Theme
function updateThemeIcon() {
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeIcon();
});

// Load theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
updateThemeIcon();

// Load tasks
document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) tasks = JSON.parse(storedTasks);

  renderTasks();
});

// Save
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<p>No tasks found</p>";
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";

    // Delete with animation
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.classList.add("removing");

      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      }, 200);
    });

    // Toggle
    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Edit
    span.addEventListener("dblclick", (e) => {
      e.stopPropagation();

      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;

      li.replaceChild(input, span);
      input.focus();

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          task.text = input.value.trim() || task.text;
          saveTasks();
          renderTasks();
        }
      });
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} task(s) left`;
}

// Add
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// Filters
allBtn.onclick = () => {
  currentFilter = "all";
  renderTasks();
};

activeBtn.onclick = () => {
  currentFilter = "active";
  renderTasks();
};

completedBtn.onclick = () => {
  currentFilter = "completed";
  renderTasks();
};

// Clear completed
clearCompletedBtn.onclick = () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
};