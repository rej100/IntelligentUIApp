let id = 0;
let categories = ['self-study', 'work', 'transport', 'workout', 'lecture', 'tutorial', 'lab', 'project meeting', 'other']
let intervals = [];
let tasksArray = [];


function storeArrayInLocalStorage() 
{
    localStorage.setItem('categories', JSON.stringify(categories));
}


function downloadArrayOnLoad() 
{
    let storedCategories = localStorage.getItem('categories');
    if (!storedCategories) 
    {
        storeArrayInLocalStorage();
        storedCategories = localStorage.getItem('categories');
    }
    categories = JSON.parse(storedCategories);

    if (localStorage.getItem('tasks')) 
    {
        tasksArray = JSON.parse(localStorage.getItem('tasks'));

        console.log("downloadArrayOnLoad")
        //console.log(tasksArray)

        tasksArray.forEach(task => 
        {
            intervals.push([task.start, task.end]);
            renderTask(task)
        });
    }
}


function addElementToArray(newElement) 
{
    if (!categories.includes(newElement) && newElement.trim() !== "") 
    {
        categories.push(newElement);
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}

// Event listener for page load
window.onload = function()
{
    downloadArrayOnLoad();

    if(tasksArray.length == 0)
    {
    addTask(8.5, 13, 'Introduction to AI', 'tutorial');
    addTask(13.5, 15.5, 'Computer Netorks', 'lecture');
    addTask(16, 18, 'IUI', 'tutorial');
    }

    console.log(tasksArray);
}

const tasks = document.getElementById("t")
for (let i = 0; i < tasks.children.length; i++) 
{
    const element = tasks.children.item(i);
    element.style.top = (((i*100)/25) + 0.8).toString() + "%";
}

function deleteTask(div, task) 
{
    intervals = intervals.filter(interval => interval[0] !== task.start || interval[1] !== task.end);
    tasksArray = tasksArray.filter( t => t.start !== task.start || t.end !== task.end || t.name !== task.name || t.category !== task.category);

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
    console.log(JSON.parse(localStorage.getItem('tasks')))

    div.remove();
}

let day = new Date().getDay(); // Gets the current day (0 = Sunday, 6 = Saturday)

function addTask(start, end, name, category)
{
    if (end > 24)
    {
        alert("You cannot schedule tasks which end tomorrow");
        return;
    }

    if (hasOverlap([start, end]))
    {
        alert("You cannot schedule 2 activities at the same time");
        return;
    }

    let task = { start: start, end: end, name: name, category: category, day: day };

    renderTask(task);
    console.log(task)
    tasksArray.push(task);
    intervals.push([start, end]); 

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function renderTask(task)
{
    let div = document.createElement('div');
    div.className = 'task';
    div.style.top = (((task.start * 100) / 25) + 0.8).toString() + "%";
    div.style.bottom = (100 - (((task.end * 100) / 25) + 0.8)).toString() + "%";
    div.innerHTML = "<span> " + task.name + " (" + task.category + ") </span>";
    div.addEventListener('click', function ()
{
        deleteTask(div, task);
    });

    tasks.append(div);
}

function cancelWindow(s)
{
    let taskDiv = document.getElementById(s);
    taskDiv.style.display = 'none';
    reset(taskDiv);
}

// resets all inputs inside given div
function reset(div)
{
    if(div.tagName === "INPUT")
    {
        div.value = null;
    }
    else
    {
        for (let i = 0; i < div.children.length; i++)
        {
            const element = div.children.item(i);
            reset(element);
        }
    }
}

function showAddWindow(s)
{
    let taskDiv = document.getElementById(s);
    taskDiv.style.display = 'flex';
    if(s !== 'addCategory')
    {
        let selectCategory = document.getElementById('category');
        selectCategory.innerHTML = '';
        for (let i = 0; i < categories.length; i++)
        {
            const element = categories[i];
            selectCategory.innerHTML += '<option value="'+ element +'">'+ element + '</option>';
        }
    }
}

function addCategory()
{
    let category = document.getElementById("newCategory").value;

    if(category === '')
    {
        alert('Fill in all input fields');
        return;
    }
    
    addElementToArray(category);

    reset(document.getElementById("addCategory"));
    cancelWindow("addCategory");
}

let list = [];
function submitTask()
{
    let taskDiv = document.getElementById("addTaskForm");
    addFormData(taskDiv, list);

    let data = true;
    list.forEach(element => {
        if(element === '')
        {
            alert("Fill in all input fields");
            data = false;
            list = [];
            return;
        }
    });

    let title = list[0];
    let first = list[1];
    let start = Number(first[0])*10 + Number(first[1]) + (Number(first[3])*10 + Number(first[4]))/60;
    let end = start + Number(list[2])/60;
    let category = list[3];

    addTask(start, end, title, category);
    list = [];
    cancelWindow("addTaskForm");
}

function addFormData(div)
{
    if(div.tagName === "INPUT" || div.tagName === "SELECT")
    {
        list.push(div.value);
    }
    else
    {
        for (let i = 0; i < div.children.length; i++)
        {
            const element = div.children.item(i);
            addFormData(element);
        }
    }
}

function hasOverlap(newInterval) 
{
    for (let interval of intervals)
    {
        if (Math.max(interval[0], newInterval[0]) < Math.min(interval[1], newInterval[1]))
        {
            return true;
        }
    }
    return false;
}