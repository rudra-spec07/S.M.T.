let tasks = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    renderTasks();
});

document.getElementById("addTaskBtn").addEventListener("click", addTask);

document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;
    const errorMsg = document.getElementById("errorMsg");

    if (title === "") {
        errorMsg.textContent = "Task title is required!";
        return;
    }

    errorMsg.textContent = "";

    const task = {
        id: Date.now(),
        title,
        description,
        priority,
        dueDate,
        completed: false
    };

    tasks.push(task);
    saveToLocalStorage();
    renderTasks();
    clearForm();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === "high") {
        filteredTasks = tasks.filter(t => t.priority === "High");
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `task-card ${task.completed ? "completed" : ""}`;

        card.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ""}</p>
            <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
            <p>${task.dueDate ? "Due: " + task.dueDate : ""}</p>

            <div class="actions">
                <button onclick="toggleComplete(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        list.appendChild(card);
    });
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("tasks");
    if (data) {
        tasks = JSON.parse(data);
    }
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("dueDate").value = "";
}