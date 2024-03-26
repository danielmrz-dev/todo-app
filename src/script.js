const TaskInput = document.querySelector(".main__input");
const tasksContainer = document.querySelector(".main__todo-list");
const lastDiv = document.querySelector(".main__todo-left-n-clear");
const toggleModeBtn = document.querySelector(".main__mode-icon");
const darkModeCheckbox = document.querySelector("#sun-moon");
const title = document.querySelector(".main__title");
const background = document.querySelector("body");
const allActiveCompleted = document.querySelector(
    ".main__all-active-completed"
);
const listItem = document.querySelectorAll(".main__todo-list-item");
const deleteTaskBtn = document.querySelectorAll(".main__icon-cross");
const allTasksBtn = document.querySelector(".main__all");
const activeTasksBtn = document.querySelector(".main__active");
const completedTasksBtn = document.querySelector(".main__completed");
const leftAndClearContainer = document.querySelector(
    ".main__todo-left-n-clear"
);
const itemsLeft = document.querySelector(".main__todo-left-number");
const clearCompletedBtn = document.querySelector(".main__todo-clear");

TaskInput.focus();

window.onload = () => {
    loadTasks();
    updateNumberOfTasks();
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
TaskInput.addEventListener("keypress", function (evento) {
    if (evento.key === "Enter" && TaskInput.value.length === 0) {
        alert("Please write a valid task!");
        evento.preventDefault();
    } else if (evento.key === "Enter" && TaskInput.value.length != 0) {
        evento.preventDefault();
        const task = {
            description: TaskInput.value,
            checked: false,
        };
        createTaskElement(TaskInput.value);
        tasks.push(task);
        updateTasks();
        TaskInput.value = "";
        updateNumberOfTasks();
    }
});

function createTaskElement(description, checked = false) {
    const newTaskContainer = document.createElement("li");
    newTaskContainer.classList.add(
        "main__todo-list-item",
        "flex",
        "items-center",
        "justify-between",
        "p-4"
    );
    newTaskContainer.setAttribute("draggable", true);
    const newTaskContent = `
            <label class="main__todo-list-item-label mr-auto flex items-center gap-4">
                <input type="checkbox" name="todo-checkbox" class="main__todo-list-checkbox" ${
                    checked ? "checked" : ""
                }>
                <p class="main__todo-list-item-description">${description}</p>
            </label>
            <img src="images/icon-cross.svg" alt="" class="main__icon-cross cursor-pointer">
        `;
    newTaskContainer.innerHTML = newTaskContent;
    tasksContainer.insertBefore(newTaskContainer, lastDiv);
}

function updateTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

tasksContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("main__icon-cross")) {
        const parentElement = event.target.closest(".main__todo-list-item");
        const taskDescription = parentElement.querySelector(
            ".main__todo-list-item-description"
        ).innerText;
        let storageTasks = JSON.parse(localStorage.getItem("tasks"));
        storageTasks = storageTasks.filter(
            (task) => task.description !== taskDescription
        );
        tasks = storageTasks;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        parentElement.remove();
        updateNumberOfTasks();
    }
});

function loadTasks() {
    const keptTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i = 0; i < keptTasks.length; i++) {
        if (keptTasks[i].checked === true) {
            createTaskElement(keptTasks[i].description, true);
        } else createTaskElement(keptTasks[i].description);
    }
}

allTasksBtn.classList.add("active-tasks")
allTasksBtn.addEventListener("click", () => {
    const allTasks = tasksContainer.querySelectorAll(".main__todo-list-item");
    allTasks.forEach((task) => {
        task.style.display = "flex";
    });
    allTasksBtn.classList.add("active-tasks")
    activeTasksBtn.classList.remove("active-tasks")
    completedTasksBtn.classList.remove("active-tasks")
});

activeTasksBtn.addEventListener("click", () => {
    filterTasks(false)
    activeTasksBtn.classList.add("active-tasks")
    allTasksBtn.classList.remove("active-tasks")
    completedTasksBtn.classList.remove("active-tasks")
});
completedTasksBtn.addEventListener("click", () => {
    filterTasks(true)
    completedTasksBtn.classList.add("active-tasks")
    allTasksBtn.classList.remove("active-tasks")
    activeTasksBtn.classList.remove("active-tasks")
});

clearCompletedBtn.addEventListener("click", () => {
    const allTasksArray = Array.from(
        tasksContainer.querySelectorAll(".main__todo-list-item")
    );
    const completedTasks = allTasksArray.filter(
        (tarefa) => tarefa.querySelector("input").checked === true
    );

    const completedTasksDescriptions = [];
    completedTasks.forEach((task) => {
        completedTasksDescriptions.push(
            task.querySelector(".main__todo-list-item-description").innerText
        );
    });

    let storageTasks = JSON.parse(localStorage.getItem("tasks"));
    let completedStorageTasks = [];
    storageTasks.forEach((task) => {
        completedStorageTasks.push(task.description);
    });

    const itemsOnBothArrays = completedTasksDescriptions.filter((task) =>
        completedStorageTasks.includes(task)
    );

    storageTasks = storageTasks.filter(
        (task) => !itemsOnBothArrays.includes(task.description)
    );

    tasks = storageTasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    completedTasks.forEach((task) => task.remove());
    updateNumberOfTasks();
});

function updateNumberOfTasks() {
    let numberOfTasks = tasksContainer.querySelectorAll(
        ".main__todo-list-item"
    ).length;
    itemsLeft.innerHTML = `${numberOfTasks} `;
}

function filterTasks(checkedOrNot) {
    const allTasks = tasksContainer.querySelectorAll(".main__todo-list-item");
    const allTasksArray = Array.from(
        tasksContainer.querySelectorAll(".main__todo-list-item")
    );
    const tarefasFiltradas = allTasksArray.filter(
        (tarefa) => tarefa.querySelector("input").checked === checkedOrNot
    );

    allTasks.forEach((task) => {
        task.style.display = "none";
    });
    tarefasFiltradas.forEach((task) => {
        task.style.display = "flex";
    });
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".main__todo-list-checkbox")) {
        const taskCheckbox = document.querySelectorAll(
            ".main__todo-list-checkbox"
        );
        taskCheckbox.forEach((checkbox) => {
            if (checkbox.checked === true) {
                const checkboxParent = checkbox.closest(
                    ".main__todo-list-item"
                );
                const checkboxDescription = checkboxParent.querySelector(
                    ".main__todo-list-item-description"
                ).innerText;

                let storageTasks = JSON.parse(localStorage.getItem("tasks"));
                storageTasks.forEach((task) => {
                    if (
                        task.description === checkboxDescription &&
                        task.checked === false
                    ) {
                        task.checked = true;
                    }
                    tasks = storageTasks;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                });
            } else {
                const checkboxParent = checkbox.closest(
                    ".main__todo-list-item"
                );
                const checkboxDescription = checkboxParent.querySelector(
                    ".main__todo-list-item-description"
                ).innerText;

                let storageTasks = JSON.parse(localStorage.getItem("tasks"));
                storageTasks.forEach((task) => {
                    if (
                        task.description === checkboxDescription &&
                        task.checked === true
                    ) {
                        task.checked = false;
                    }
                    tasks = storageTasks;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                });
            }
        });
    }
});

darkModeCheckbox.addEventListener("change", () => {
    background.classList.toggle("dark-bg");
    TaskInput.classList.toggle("grey-container");
    tasksContainer.classList.toggle("grey-container");
    allActiveCompleted.classList.toggle("grey-container");
    leftAndClearContainer.classList.toggle("grey-container");

    let icon = toggleModeBtn.getAttribute("src");
    if (icon === "images/icon-moon.svg") {
        toggleModeBtn.setAttribute("src", "images/icon-sun.svg");
    } else {
        toggleModeBtn.setAttribute("src", "images/icon-moon.svg");
    }
});
