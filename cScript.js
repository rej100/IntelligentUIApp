class RGBA
{
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b,
        this.a = a;
    }
    toString()
    {
        // rgba(0, 0, 0, 0.25)
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }
}

class Task
{
    constructor(text, importance, date, color, category, id)
    {
        this.text = text;
        this.importance = importance;
        this.date = date;
        this.color = color;
        this.category = category;
        this.id = id;

        this.done = false;
    }
}

document.getElementById("createTaskPageContainer").style.display="none"

lastTaskID = 0;
tasks = [];

document.getElementById("createTaskBtn").addEventListener("click", handleCreateTaskBtn);
document.getElementById("clearDoneBtn").addEventListener("click", handleClearDoneBtn);
document.getElementById("taskAcceptBtn").addEventListener("click", handleTaskAcceptBtn);
document.getElementById("taskCancelBtn").addEventListener("click", handleTaskCancelBtn);

function handleCreateTaskBtn()
{
    switchToCreateTaskPage()
    // createTask("test"+lastTaskID, 10, new Date(2024,0,1), new RGBA(255,255,255,1), 3)
}
function handleClearDoneBtn()
{
    clearDoneTasks()
    rebuildTasks()
}
function handleTaskAcceptBtn()
{
    taskDescription = document.getElementById('text').value;
    importance = document.getElementById('importance').value;
    dueDate = document.getElementById('date').value;
    color = document.getElementById('color').value;
    category = document.getElementById('category').value;
    
    if(dueDate == "")
    {
        dueDate = null
    }
    else
    {
        dueDate = new Date(dueDate)
    }
    color = hexToRGBA(color)
    category = parseInt(category)

    createTask(taskDescription, importance, dueDate, color, category)
    rebuildTasks()
    switchToTaskPage()
}
function handleTaskCancelBtn()
{
    switchToTaskPage()
    rebuildTasks()
}

function switchToCreateTaskPage()
{
    document.getElementById("taskPageContainer").style.display="none"
    document.getElementById("createTaskPageContainer").style.cssText=""
}

function switchToTaskPage()
{
    document.getElementById("taskPageContainer").style.cssText=""
    document.getElementById("createTaskPageContainer").style.display="none"
}

function rebuildTasks()
{
    removeAllTasks();
    buildTasks();
}

function buildTasks()
{
    tasks.forEach(task =>
    {
        addTaskToTaskList(task);
    })
}

function removeAllTasks()
{
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task =>
    {
        task.remove();
    });
}

function clearDoneTasks()
{
    tasks = tasks.filter(task => !task.done)
}

function addTaskToTaskList(task)
{
    taskCategoryContainer = document.getElementById("taskCategory" +task.category);
    taskList = taskCategoryContainer.querySelector(".taskList")

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.style.backgroundColor = task.color.toString();

    const taskLeftDiv = document.createElement("div");
    taskLeftDiv.classList.add("taskLeft");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () =>
    {
        task.done = checkbox.checked;
    });

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    taskLeftDiv.appendChild(checkbox);
    taskLeftDiv.appendChild(taskText);

    const taskRightDiv = document.createElement("div");
    taskRightDiv.classList.add("taskRight");

    const taskImportanceDiv = document.createElement("div");
    taskImportanceDiv.classList.add("taskImportance");
    taskImportanceDiv.textContent = task.importance;

    const taskDateDiv = document.createElement("div");
    taskDateDiv.classList.add("taskDate");
    taskDateDiv.textContent = formatDate(task.date);

    taskRightDiv.appendChild(taskImportanceDiv);
    taskRightDiv.appendChild(taskDateDiv);

    taskDiv.appendChild(taskLeftDiv);
    taskDiv.appendChild(taskRightDiv);

    taskList.appendChild(taskDiv);
}

function createTask(text, importance, date, color, category)
{
    newTask = new Task(text, importance, date, color, category, lastTaskID);
    tasks.push(newTask);
    lastTaskID++;
}

function formatDate(date)
{
    if (date)
    {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
    
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
    
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
    else
    {
        return ""
    }
}

function hexToRGBA(hex)
{
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = 1.0;

    return new RGBA(r, g, b, a)
}

