let counter =0;

// Function to add new task to the lists
const addNewTask = (type) => {
    let inputValue
    if (type== "span-add-pending") {
        inputValue = document.getElementById("task-name").value;
    }else if (type== "span-add-completed") {
        inputValue = document.getElementById("task-completed").value;
    } else {
        inputValue = type;
    }
    if (inputValue != ""){
        let addTaskFormType = "";
        if (type == "span-add-pending") {
            addTaskFormType = "span-add-task";
            pendingTaskStorage(inputValue, "pendingTasks")
        }
        if (type == "span-add-completed") {
            addTaskFormType = "span-add-completed";
            pendingTaskStorage(inputValue, "completedTasks")
        }
        addTaskFormType != "" ? addTaskForm(addTaskFormType) : null;
        document.getElementById("task-name").value = "";
        document.getElementById("task-completed").value = "";
    } else {
        alert("Debes ingresar el nombre de la tarea");
    }
}

const pendingTaskStorage = (value, type) => {
    if (localStorage.getItem(type) === null) {
        const Taskslist = [];
        Taskslist.push(value);
        localStorage.setItem(type, JSON.stringify(Taskslist));
    } else {
        const completedTasks = localStorage.getItem(type);
        const completedTasksLists = JSON.parse(completedTasks);
        completedTasksLists.push(value);
        localStorage.setItem(type, JSON.stringify(completedTasksLists));
    }
}

//Function to show/hide task form
const addTaskForm = (type) => {
    let addTask;
    let taskForm;
    if (type == "span-add-task" || type == "cancel-add") {
        addTask = document.getElementById("add-task");
        taskForm = document.getElementById("task-form");
    }
    if (type == "span-add-completed" || type == "cancel-completed") {
        addTask = document.getElementById("add-completed");
        taskForm = document.getElementById("completed-form");
    }
    if (addTask.style.display == "block") {
        addTask.style.display = "none";
        taskForm.style.display = "block";
    } else {
        addTask.style.display = "block";
        taskForm.style.display = "none";
    }
}

// Function to verify if task if completed (checked), so it should be added to the completed task list
const addCompletedTask = (taskID) => {
    const taskRow = document.getElementById(taskID);
    if (taskRow.checked) {
        const taskName = taskRow.nextElementSibling.textContent;
        cleanLocalStorageValue(taskName, "pendingTasks");
        taskRow.parentElement.remove()
        if (localStorage.getItem("completedTasks") === null) {
            const Taskslist = [];
            Taskslist.push(taskName);
            localStorage.setItem("completedTasks", JSON.stringify(Taskslist));
        } else {
            const completedTasks = localStorage.getItem("completedTasks");
            const completedTasksLists = JSON.parse(completedTasks);
            completedTasksLists.push(taskName);
            localStorage.setItem("completedTasks", JSON.stringify(completedTasksLists));
        }
    }
}

const close = document.getElementsByClassName("close");
for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
        const div = this.parentElement;
        div.remove();
    }
}

// Clean localStorage when refresh
window.onload = window.localStorage.clear();
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    const event = new Event('itemInserted');
    event.value = value;
    event.key = key;
    document.dispatchEvent(event);
    originalSetItem.apply(this, arguments);
};

// Function that removes pending tasks from localstorage
const cleanLocalStorageValue = (value, type) =>{
    const completedTasks = localStorage.getItem(type);
    const tasksList = JSON.parse(completedTasks);
    const taskfiltered = tasksList.filter((item)=> item != value)
    localStorage.setItem(type, JSON.stringify(taskfiltered));
}

// Function to add completed task to the completed tasks list
const localStorageSetHandler = function(e) {
    let listIdentifier = e.key == "completedTasks"? "completed-list" : "tasks-list";
    document.getElementById(listIdentifier).innerHTML = "";
    const completedList = JSON.parse(e.value);
    completedList.map((item) => {
        const li = document.createElement("li");
        if(e.key == "pendingTasks"){
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.className = "task-status";
            checkbox.id = `list-item-task-${counter}`;
            checkbox.onclick = function() { 
                addCompletedTask(this.id); 
            };
            li.appendChild(checkbox);
        }
        counter++;
        const taskTxt = document.createElement("p");
        const newTask = document.createTextNode(item);
        taskTxt.id = `list-item-completed-${counter}`;
        taskTxt.appendChild(newTask);
        li.appendChild(taskTxt);
        if (e.key=="pendingTasks") {
            const editIcon = document.createElement("img");
            editIcon.src="img/edit.png";
            editIcon.style.maxWidth = "20px";
            li.appendChild(editIcon);
        }
        const deleteIcon = document.createElement("img");
        deleteIcon.src="img/delete.png";
        deleteIcon.style.maxWidth = "20px";
        deleteIcon.className="close";
        li.appendChild(deleteIcon);
        document.getElementById(listIdentifier).appendChild(li);
        for (let i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                console.log("here")
                const div = this.parentElement;
                div.remove();
                let taskName;
                console.log(taskName)
                if (e.key == "completedTasks"){
                    taskName = this.previousElementSibling.textContent;
                    pendingTaskStorage(taskName, "pendingTasks");
                    cleanLocalStorageValue(taskName, "completedTasks");
                }
                if (e.key == "pendingTasks"){
                    taskName = this.previousElementSibling.previousElementSibling.textContent;
                    cleanLocalStorageValue(taskName, "pendingTasks");
                }
            }
        }
    }) 
};

// Event listener to listen localStorage changes
document.addEventListener("itemInserted", localStorageSetHandler, false);
