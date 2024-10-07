let id = 0;
let categories = ['self-study', 'work', 'transport', 'workout', 'lecture', 'tutorial', 'lab', 'project meeting', 'other']
let intervals = [];
let tasksArray = [];
let taskMap = new Map();
let currDay = new Date().getDay(); // Gets the current day (0 = Sunday, 6 = Saturday)
// let currDay = 1

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

    if (localStorage.getItem('activities')) 
    {
        tasksArray = JSON.parse(localStorage.getItem('activities'));
        let oldTasks = []
        tasksArray.forEach(task => 
        {
            if(task.day === currDay)
            {
                intervals.push([task.start, task.end]);
                renderTask(task)
            } 
            else
            {
                oldTasks.push(task);
            }
        });
        //delete tasks from yesterday
        tasksArray = tasksArray.filter(t => !oldTasks.includes(t));

        localStorage.setItem('activities', JSON.stringify(tasksArray));
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

const tasks = document.getElementById("t")
function populateDailyPlanner()
{
    loadTaskMapFromStorage();
    archList = getFrequentTasksForDay(currDay);

    archList.forEach(task => 
    {
        if(task.day === currDay)
        {
            addTask(task.start, task.end, task.name, task.category, true);
        } 
    });
}

// Event listener
window.onload = function()
{
    //downloadArrayOnLoad();
}

for (let i = 0; i < tasks.children.length; i++) 
{
    const element = tasks.children.item(i);
    element.style.top = (((i*100)/25) + 0.8).toString() + "%";
}

function deleteTask(div, task) 
{
    intervals = intervals.filter(interval => interval[0] !== task.start || interval[1] !== task.end);
    tasksArray = tasksArray.filter( t => t.start !== task.start || t.end !== task.end || t.name !== task.name || t.category !== task.category);

    localStorage.setItem('activities', JSON.stringify(tasksArray));

    div.remove();
}

function addTask(start, end, name, category, fromArchive)
{
    if (end > 24)
    {
        if(!fromArchive) alert("You cannot schedule tasks which end tomorrow");
        return;
    }

    if (hasOverlap([start, end]))
    {
        if(!fromArchive) alert("You cannot schedule 2 activities at the same time");
        return;
    }

    let task = { start: start, end: end, name: name, category: category, day: currDay };

    renderTask(task);
    if(!fromArchive) addToArchive(task);
    tasksArray.push(task);
    intervals.push([start, end]); 

    localStorage.setItem('activities', JSON.stringify(tasksArray));
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

    addTask(start, end, title, category, false);
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

function generateTaskKey(task) {
    return `start:${task.start}|end:${task.end}|name:${task.name}|category:${task.category}|day:${task.day}`;
}

function createArchive(arr) {
    for (const task of arr) {
        const taskKey = generateTaskKey(task);

        if (taskMap.has(taskKey)) {
            const entry = taskMap.get(taskKey);
            entry.count++;
        } else {
            taskMap.set(taskKey, {
                count: 1,
                task: task
            });
        }
    }
}
function addToArchive(task)
{
    const taskKey = generateTaskKey(task);

    if (taskMap.has(taskKey))
    {
        const entry = taskMap.get(taskKey);
        entry.count++;
    } 
    else 
    {
        taskMap.set(taskKey, {
            count: 1,
            task: task
        });
    }
    saveTaskMap();
}

/**
 * Function to get the top 50% tasks based on frequency for a given day.
 * @param {number} day - The day number (e.g., 1 for Monday, 2 for Tuesday, etc.)
 * @returns {Array} - An array of tasks meeting the criteria
 */
function getFrequentTasksForDay(day) {
    
    let taskFrequencyForDay = [];

    for (const [taskKey, entry] of taskMap.entries()) 
    {
        if(entry.task.day === day)
        {
            taskFrequencyForDay.push
            ({
                count: entry.count,
                task: entry.task
            });
        }
    }

    if (taskFrequencyForDay.length === 0) return [];

    taskFrequencyForDay.sort((a, b) => b.count - a.count);

    let N = Math.floor(taskFrequencyForDay.length / 2);

    for (let i = N; i < taskFrequencyForDay.length; i++)
    {
        if(taskFrequencyForDay.at(i).count === taskFrequencyForDay.at(N).count) N = Math.max(N, i);
    }

    // Get the top N tasks
    const topTasks = taskFrequencyForDay.slice(0, N + 1).map(entry => entry.task);

    return topTasks;
}

// Function to download (save) the taskMap to localStorage
function saveTaskMap() {
    // Convert the taskMap to an array of entries
    const taskMapArray = Array.from(taskMap.entries()).map(([taskKey, entry]) => {
        return [
            taskKey,
            {
                count: entry.count,
                task: entry.task
            }
        ];
    });

    // Serialize the array to a JSON string
    const serializedTaskMap = JSON.stringify(taskMapArray);

    // Save to localStorage
    localStorage.setItem('taskMap', serializedTaskMap);
}

// Function to upload (load) the taskMap from localStorage
function loadTaskMapFromStorage() {
    // Retrieve the serialized taskMap from localStorage
    const serializedTaskMap = localStorage.getItem('taskMap');

    if (serializedTaskMap) {
        const taskMapArray = JSON.parse(serializedTaskMap);
        taskMap = new Map();

        for (const [taskKey, entry] of taskMapArray) {
            
            taskMap.set(taskKey, {
                count: entry.count,
                task: entry.task
            });
        }
    } else {
        // If no data is found, initialize the taskMap
        initArchive();
    }
}

function initArchive()
{
    const arr = [
        {
            "start": 11,
            "end": 13,
            "name": "IUI",
            "category": "tutorial",
            "day": 1
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 1
        },
        {
            "start": 16,
            "end": 18,
            "name": "Introduction to AI",
            "category": "lecture",
            "day": 1
        },
        {
            "start": 8.5,
            "end": 13,
            "name": "Introduction to AI",
            "category": "tutorial",
            "day": 2
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "IUI",
            "category": "tutorial",
            "day": 2
        },
        {
            "start": 16,
            "end": 18,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 2
        },
        {
            "start": 8.5,
            "end": 13,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 3
        },
        {
            "start": 14,
            "end": 15.5,
            "name": "self-study",
            "category": "self-study",
            "day": 3
        },
        {
            "start": 10.5,
            "end": 12,
            "name": "workout",
            "category": "workout",
            "day": 4
        },
        {
            "start": 13.5,
            "end": 18,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 4
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 5
        },
        {
            "start": 16,
            "end": 18,
            "name": "IUI",
            "category": "lecture",
            "day": 5
        },
        {
            "start": 12.5,
            "end": 14,
            "name": "workout",
            "category": "workout",
            "day": 6
        },
        {
            "start": 10.0,
            "end": 12.0,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 6
        },
        {
            "start": 16.0,
            "end": 17.0,
            "name": "Afternoon Workout",
            "category": "workout",
            "day": 6
        },
        {
            "start": 12.5,
            "end": 13.5,
            "name": "Lunch",
            "category": "other",
            "day": 0
        },
        {
            "start": 15.0,
            "end": 17.0,
            "name": "Complete Lab Assignment",
            "category": "lab",
            "day": 0
        },
        {
            "start": 11,
            "end": 13,
            "name": "IUI",
            "category": "tutorial",
            "day": 1
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 1
        },
        {
            "start": 16,
            "end": 18,
            "name": "Introduction to AI",
            "category": "lecture",
            "day": 1
        },
        {
            "start": 8.5,
            "end": 13,
            "name": "Introduction to AI",
            "category": "tutorial",
            "day": 2
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "IUI",
            "category": "tutorial",
            "day": 2
        },
        {
            "start": 16,
            "end": 18,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 2
        },
        {
            "start": 8.5,
            "end": 13,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 3
        },
        {
            "start": 14,
            "end": 15.5,
            "name": "self-study",
            "category": "self-study",
            "day": 3
        },
        {
            "start": 13.5,
            "end": 18,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 4
        },
        {
            "start": 13.5,
            "end": 15.5,
            "name": "Computer Networks",
            "category": "lecture",
            "day": 5
        },
        {
            "start": 16,
            "end": 18,
            "name": "IUI",
            "category": "lecture",
            "day": 5
        },
        {
            "start": 12.5,
            "end": 14,
            "name": "workout",
            "category": "workout",
            "day": 6
        },
        {
            "start": 10.0,
            "end": 12.0,
            "name": "Project Meeting",
            "category": "project meeting",
            "day": 6
        },
        {
            "start": 16.0,
            "end": 17.0,
            "name": "Afternoon Workout",
            "category": "workout",
            "day": 6
        },
        {
            "start": 12.5,
            "end": 13.5,
            "name": "Lunch",
            "category": "other",
            "day": 0
        },
        {
            "start": 15.0,
            "end": 17.0,
            "name": "Complete Lab Assignment",
            "category": "lab",
            "day": 0
        },
    ];
    createArchive(arr);
    saveTaskMap()
}