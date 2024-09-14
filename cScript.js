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

document.getElementById("createTaskContainer").style.display = "none";

lastTaskID = 0;
tasks = [];

document.getElementById("btnAdd").addEventListener("click", handleAddBtn);
document.getElementById("taskAcceptButton").addEventListener("click", handleTaskAcceptBtn);
document.getElementById("taskCancelButton").addEventListener("click", handleTaskCancelBtn);



function handleAddBtn()
{

    switchToCreateTask();
}

function handleTaskAcceptBtn()
{
    text = document.getElementById("tcText").value;
    date = new Date(document.getElementById("tcDate").value);
    importance = document.getElementById("tcImportance").value;
    color = hexToRGBA(document.getElementById("tcColor").value);
    category = parseInt(document.getElementById("tcSection").value);
    createTask(text, importance, date, color, category)

    rebuildTasks();
    switchToTaskList();
}

function handleTaskCancelBtn()
{
    rebuildTasks();
    switchToTaskList();
}

function switchToCreateTask()
{
    document.getElementById("doitContainer").style.display = "none";
    document.getElementById("phoneNavbar").style.display = "none";

    document.getElementById("createTaskContainer").style.display = "flex";
}

function switchToTaskList()
{
    document.getElementById("doitContainer").style.display = "flex";
    document.getElementById("phoneNavbar").style.display = "flex";
    document.getElementById("createTaskContainer").style.display = "none";
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
        addTask(task);
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

function addTask(taskObj)
{
    // Create new task elements
    const taskContainer = document.getElementById("c" + taskObj.category).querySelector(".taskContainer")
    
    const task = document.createElement('div');
    task.classList.add('task');
    task.style.backgroundColor = taskObj.color.toString();
    
    const taskLeft = document.createElement('div');
    taskLeft.classList.add('taskLeft');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('taskCheckbox');
    taskLeft.appendChild(checkbox);

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('taskSpan');
    taskSpan.textContent = taskObj.text;
    taskLeft.appendChild(taskSpan);
    
    const taskRight = document.createElement('div');
    taskRight.classList.add('taskRight');

    const taskImpCont = document.createElement('div');
    taskImpCont.classList.add('taskImpCont');

    const taskImpSpan = document.createElement('span');
    taskImpSpan.classList.add('taskImpSpan');
    taskImpSpan.textContent = taskObj.importance;
    taskImpCont.appendChild(taskImpSpan);
    taskRight.appendChild(taskImpCont);

    const taskDateSpan = document.createElement('span');
    taskDateSpan.classList.add('taskDateSpan');
    taskDateSpan.textContent = formatDate(taskObj.date)
    taskRight.appendChild(taskDateSpan);
    
    task.appendChild(taskLeft);
    task.appendChild(taskRight);
    
    // Append the new task to the task container
    taskContainer.appendChild(task);
}

function createTask(text, importance, date, color, category)
{
    newTask = new Task(text, importance, date, color, category, lastTaskID);
    tasks.push(newTask);
    lastTaskID++;
}

function formatDate(date)
{
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
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

