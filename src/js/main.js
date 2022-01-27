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
const edit = document.getElementsByClassName("edit");
const closeEditing = document.getElementsByClassName("closeEditing");
const submitEditing = document.getElementsByClassName("submitEditing");


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
    let listIdentifier;
    if (e.key == "completedTasks") listIdentifier = "completed-list";
    if (e.key == "pendingTasks") listIdentifier = "tasks-list";
    if (e.key == "tasks-list" || e.key == "completed-list" ) listIdentifier = e.key;
    if (e.key == "completedTasks" || e.key == "pendingTasks") {
        document.querySelectorAll(".pending-search, .completed-search").forEach(item => item.value="")
    }
    document.getElementById(listIdentifier).innerHTML = "";
    const completedList = JSON.parse(e.value);
    completedList && completedList.map((item) => {
        const li = document.createElement("li");
        if(e.key == "pendingTasks" || e.key=="tasks-list"){
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
        taskTxt.appendChild(newTask);
        li.appendChild(taskTxt);
        if (e.key=="pendingTasks" || e.key=="tasks-list") {
            const editIcon = document.createElement("img");
            editIcon.src="img/edit.png";
            editIcon.className="edit";
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
                const div = this.parentElement;
                div.remove();
                let taskName;
                if (e.key == "completedTasks" || e.key=="completed-list"){
                    taskName = this.previousElementSibling.textContent;
                    pendingTaskStorage(taskName, "pendingTasks");
                    cleanLocalStorageValue(taskName, "completedTasks");
                }
                if (e.key == "pendingTasks" || e.key=="tasks-list"){
                    taskName = this.previousElementSibling.previousElementSibling.textContent;
                    cleanLocalStorageValue(taskName, "pendingTasks");
                }
            }
        }
        let isEditing = false;
        for (let i = 0; i < edit.length; i++) {
            edit[i].onclick = function() {
                if (!isEditing) {
                    const parent = this.parentElement;
                const children = parent.children;
                let arrayOfChildren = Array.from(children);
                const editTaskName = this.previousElementSibling.textContent;
                const editContainer = document.createElement("div");
                editContainer.style.display = "flex";
                editContainer.style.width = "100%";
                editContainer.style.justifyContent = "space-around";
                const editInput = document.createElement("input");
                editInput.value = editTaskName;
                editInput.setAttribute("type", "text");
                const editImg = document.createElement("img");
                editImg.src="img/checked.png";
                editImg.style.maxWidth = "20px";
                editImg.style.paddingTop = "10px";
                editImg.style.paddingBottom = "10px";
                editImg.className="submitEditing";
                const cancelEditImg = document.createElement("img");
                cancelEditImg.src="img/cancel.png";
                cancelEditImg.style.maxWidth = "18px";
                cancelEditImg.style.paddingTop = "10px";
                cancelEditImg.style.paddingBottom = "10px";
                cancelEditImg.className="closeEditing";
                editContainer.appendChild(editInput);
                editContainer.appendChild(editImg);
                editContainer.appendChild(cancelEditImg);
                parent.replaceChildren(editContainer);
                isEditing = true;
                for (let i = 0; i < closeEditing.length; i++) {
                    closeEditing[i].onclick = function() {
                        this.parentElement.parentElement.replaceChildren(...arrayOfChildren);
                        isEditing=false;
                    }
                }
                for (let i = 0; i < submitEditing.length; i++) {
                    submitEditing[i].onclick = function() {
                        const editedTaskName = this.previousElementSibling.value;
                        updateTask(editTaskName, editedTaskName);
                        isEditing=false;
                    }
                }
                }
            }
        }
    }) 
};

// Event listener to listen localStorage changes
document.addEventListener("itemInserted", localStorageSetHandler, false);

// Get search values when click on search icon
const iconSearchTask = (searchId) => {
    const input = document.getElementById(searchId)
    inputSearchValue = input.value;
    searchInStorage(searchId, inputSearchValue);
}

// Search funcionality
const searchInStorage = (searchId, inputSearchValue) => {
    const identifier = searchId == "pending-search"? "pendingTasks" : "completedTasks";
    const searchSection = searchId == "pending-search"? "tasks-list" : "completed-list";
    const storageList = localStorage.getItem(identifier);
    const tasksList = JSON.parse(storageList);
    const filteredList = tasksList && tasksList.filter((item)=> item.toLowerCase().includes(inputSearchValue.toLowerCase()));
    localStorage.setItem(searchSection, JSON.stringify(filteredList));
}

// Update task name 
const updateTask = (oldValue, newValue) => {
    const pendingTasks = localStorage.getItem("pendingTasks");
    const pendingTasksList = JSON.parse(pendingTasks);
    const oldTaskIndex = pendingTasksList.indexOf(oldValue);
    pendingTasksList[oldTaskIndex] = newValue;
    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasksList));
}