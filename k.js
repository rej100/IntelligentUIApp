const tasks = document.getElementById("t")
let id = 0;
let categories = ['self-study', 'work', 'transport', 'workout', 'lecture', 'tutorial', 'lab', 'project meeting', 'other', 'nap']
let intervals = [];

for (let i = 0; i < tasks.children.length; i++) 
{
    const element = tasks.children.item(i);
    
    element.style.top = (((i*100)/25) + 0.8).toString() + "%";
}

function addTask(start, end, name, category)
{
    if(end > 24) 
    {
        alert("You cannot schedule tasks which end tommorow");
        return;
    }

    if(hasOverlap([start, end])) 
    {
        alert("You cannot schedule 2 activities at the same time");
        return;
    }   

    let div = document.createElement('div');
    div.className = 'task';
    div.style.top = (((start*100)/25) + 0.8).toString() + "%";
    div.style.bottom = (100 - (((end*100)/25) + 0.8)).toString() + "%";
    div.innerHTML =  "<span> " + name + " ("+ category + ")" +" </span>";
    tasks.append(div)

    intervals.push([start, end]); 
}

addTask(2, 2.5, 'niespanie', 'lol');
addTask(7, 12.5, 'niespanie', 'lol');
addTask(20, 22, 'niespanie', 'lol');
//addTask(8, 11, 'spanie', 'yup');


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
    
    if(categories.includes(category)) alert("This category already exisits");
    else categories.push(category);

    reset(document.getElementById("addCategory"));
    cancelWindow("addCategory");
}

let list = [];
function submitTask()
{
    let taskDiv = document.getElementById("addTaskForm");
    addFormData(taskDiv, list);

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

function hasOverlap(newTask) 
{
    if(intervals.length === 0) return false;
    intervals.sort((a, b) => a[0] - b[0]);

    function bs()
    {
        let left = 0;
        let right = intervals.length;

        while (left < right) 
        {
            let mid = Math.floor((left + right) / 2);

            if (intervals[mid][0] > newTask[0]) 
            {
                right = mid - 1;
            } 
            else 
            {
                left = mid + 1;
            }
        }

        return left - 1; // position of the "left" interval
    };

    let pos = bs();

    if (pos >= 0 && intervals[pos][1] > newTask[0]) 
    {
        return true;
    }

    if (pos + 1 < intervals.length && intervals[pos + 1][0] < newTask[1]) 
    {
        return true;
    }

    return false;
}