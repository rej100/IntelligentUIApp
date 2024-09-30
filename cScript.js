
themeid = 0;
lastTaskID = 0;
tasks = [];
tasksHistory = [];
loadState();

if(localStorage.getItem("firstUse") == null)
{
    switchToFirstUsePage();
}
else
{
    switchToTaskPage();
}

document.getElementById("changeThemeBtn").addEventListener("click", handleChangeThemeBtn);
document.getElementById("createTaskBtn").addEventListener("click", handleCreateTaskBtn);
document.getElementById("clearDoneBtn").addEventListener("click", handleClearDoneBtn);

document.getElementById("taskAcceptBtn").addEventListener("click", handleTaskAcceptBtn);
document.getElementById("taskCancelBtn").addEventListener("click", handleTaskCancelBtn);

document.getElementById("firstUseAcceptBtn").addEventListener("click", handlefirstUseAcceptBtn);
initialiseFirstUseButtonsLogic();

function initialiseFirstUseButtonsLogic()
{
    document.querySelectorAll('.fuCategory').forEach(function(div)
    {
        div.addEventListener('click', function()
        {
            // Toggle between green and gray
            const isSelected = div.getAttribute('data-selected') === 'true';
            
            if (isSelected)
            {
                div.style.backgroundColor = 'lightgray';  // Set to gray
                div.setAttribute('data-selected', 'false');
            }
            else
            {
                div.style.backgroundColor = 'lightgreen';  // Set to green
                div.setAttribute('data-selected', 'true');
            }
        });
    });
}

function saveState()
{
    console.log("saving")
    localStorage.setItem("saved", "true")
    localStorage.setItem("themeid", themeid);
    localStorage.setItem("lastTaskID", lastTaskID);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("tasksHistory", JSON.stringify(tasksHistory));
}

function loadState()
{
    if (!(localStorage.getItem("saved") == null))
    {
        console.log("loading state")

        themeid = parseInt(localStorage.getItem("themeid"));

        lastTaskID = parseInt(localStorage.getItem("lastTaskID"));

        tempTasks = JSON.parse(localStorage.getItem("tasks"));
        tasks = [];
        tempTasks.forEach(tempTask=>
        {
            tasks.push(Task.fromFakeTask(tempTask));
        });

        tempTasksHistory = JSON.parse(localStorage.getItem("tasksHistory"));
        tasksHistory = [];
        tempTasksHistory.forEach(tempTask=>
        {
            tasksHistory.push(Task.fromFakeTask(tempTask));
        });

        changeTheme(themeid);
        rebuildTasks();
    }
    else
    {
        console.log("no saved state")
    }
}

function handleChangeThemeBtn()
{
    if (themeid == 0)
    {
        themeid = 1;
    }
    else 
    {
        themeid = 0;
    }
    changeTheme(themeid);
    saveState();
}
function handleCreateTaskBtn()
{
    switchToCreateTaskPage()
    // createTask("test"+lastTaskID, 10, new Date(2024,0,1), new RGBA(255,255,255,1), 3)
}
function handleClearDoneBtn()
{
    clearDoneTasks()
    rebuildTasks()
    saveState();
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
    saveState();
}
function handleTaskCancelBtn()
{
    switchToTaskPage()
    rebuildTasks()
}

function handlefirstUseAcceptBtn()
{
    var boolValues = []
    document.querySelectorAll('.fuCategory').forEach(function(div)
    {
        var index = div.getAttribute("data-id");
        var boolValue = div.getAttribute("data-selected");
        boolValue = (boolValue === "true");
        boolValues[index] = boolValue
    });

    var valid = false;
    boolValues.forEach(boolValue =>
    {
        if (boolValue)
        {
            valid = true;
        }
    });

    if (!valid)
    {
        alert("Please select at least one category.")

    }
    else
    {
        generateDummyTasks(boolValues, tasksHistory);
        localStorage.setItem("firstUse", "false");
        saveState();
        switchToTaskPage();
    }
}

function changeTheme(themeid)
{
    stylesheetLink = document.getElementById("stylesheetLink");
    changeThemeBtn = document.getElementById("changeThemeBtn");
    img = changeThemeBtn.querySelector("img");
    if (themeid == 0)
    {
        stylesheetLink.setAttribute("href", "cStyle.css");
        img.setAttribute("src", "cResources\\moon.png");
    }
    else if (themeid == 1)
    {
        stylesheetLink.setAttribute("href", "cStyleDark.css");
        img.setAttribute("src", "cResources\\sun.png");
    }
}

function switchToTaskPage()
{
    document.getElementById("taskPageContainer").style.cssText="";
    document.getElementById("createTaskPageContainer").style.display="none";
    document.getElementById("firstUsePageContainer").style.display="none";
    rebuildTasks();
}

function switchToCreateTaskPage()
{
    document.getElementById("taskPageContainer").style.display="none";
    document.getElementById("createTaskPageContainer").style.cssText="";
    document.getElementById("firstUsePageContainer").style.display="none";
}
function switchToFirstUsePage()
{
    document.getElementById("taskPageContainer").style.display="none";
    document.getElementById("createTaskPageContainer").style.display="none";
    document.getElementById("firstUsePageContainer").style.cssText="";
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
        saveState();
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
    newTask = new Task(text, importance, date, color, category, lastTaskID, false, new Date());
    tasks.push(newTask);
    tasksHistory.push(newTask);
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

