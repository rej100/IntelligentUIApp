class RGBA
{
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString()
    {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }

    toStringHex()
    {
        const toHex = (value) =>
        {
            let hex = value.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        const rHex = toHex(this.r);
        const gHex = toHex(this.g);
        const bHex = toHex(this.b);

        return `#${rHex}${gHex}${bHex}`;
    }
}

class Task
{
    constructor(text, importance, date, color, category, id, done, creationDate)
    {
        this.text = text; // Task description
        this.importance = importance; // Integer from 0-10
        this.date = date; // Javascript Date object
        this.color = color; // Instance of class RGBA
        this.category = category; // Integer from 1-3, higher is more important
        this.id = id; // unique id, should be -1 for dummy tasks
        this.done = done; // boolean representing whether the task has been completed
        this.creationDate = creationDate // Javascript Date object
    }

    static fromFakeTask(fakeTask)
    {
        var text = fakeTask.text;
        var importance = fakeTask.importance;
        var date = new Date(fakeTask.date)
        var color = new RGBA(fakeTask.color.r, fakeTask.color.g, fakeTask.color.b, fakeTask.color.a);
        var category = fakeTask.category;
        var id = fakeTask.id;
        var done = fakeTask.done;
        var creationDate = new Date(fakeTask.creationDate);

        return new Task(text, importance, date, color, category, id, done, creationDate);
    }
}

// const categories =
// {
//     "Personal Growth": ["Read a new book", "Watch a TED talk", "Practice meditation"],
//     "Work & Projects": ["Complete project report", "Respond to client emails", "Prepare presentation"],
//     "Health & Fitness": ["Go to the gym", "Try a new yoga class", "Plan a healthy meal"],
//     "Home & Family": ["Clean the living room", "Go grocery shopping", "Fix the leaking sink"],
//     "Finance": ["Pay electricity bill", "Review monthly budget", "Invest in stocks"],
//     "Social": ["Catch up with an old friend", "Attend a networking event", "Plan a dinner party"],
//     "Creative": ["Write a short story", "Sketch a landscape", "Learn a new song on guitar"]
// };

const categories =
{
    "0": ["Read a new book", "Watch a TED talk", "Practice meditation"],
    "1": ["Complete project report", "Respond to client emails", "Prepare presentation"],
    "2": ["Go to the gym", "Try a new yoga class", "Plan a healthy meal"],
    "3": ["Clean the living room", "Go grocery shopping", "Fix the leaking sink"],
    "4": ["Pay electricity bill", "Review monthly budget", "Invest in stocks"],
    "5": ["Catch up with an old friend", "Attend a networking event", "Plan a dinner party"],
    "6": ["Write a short story", "Sketch a landscape", "Learn a new song on guitar"]
};

function generateDummyTasks(boolValues, tasksHistory)
{
    for (let i = 0; i < boolValues.length; i++)
    {
        if(boolValues[i])
        {
            generateDummyTasksFromCategory(i, tasksHistory);
        }
    }
}

function generateDummyTasksFromCategory(categoryIndex, tasksHistory)
{
    var indexAsString = String(categoryIndex);
    var textArray = categories[indexAsString];
    for (let i = 0; i < textArray.length; i++)
    {
        var text = textArray[i];
        tasksHistory.push(generateDummyTask(text, i+1, -1));
    }
}

function generateDummyTask(text, category, id)
{
    var importance = 0
    if (category == 1)
    {
        importance = Math.floor(Math.random() * 4);
    }
    else if (category == 2)
    {
        importance = Math.floor(Math.random() * 4) + 3;
    }
    else if (category == 3)
    {
        importance = Math.floor(Math.random() * 4) + 7;
    }

    const date = getRandomDate();
    const color = getRandomColor();
    const done = false;
    const creationDate = new Date();
    return new Task(text, importance, date, color, category, id, done, creationDate);
}

function getRandomDate()
{
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1); // Random date within the next 10 days
    return futureDate;
}

function getRandomColor()
{
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    const a = 1;
    return new RGBA(r, g, b, a);
}

function generateTaskSuggestion(tasksHistory, category)
{
    var tasksHistorySC = [];
    tasksHistory.forEach(task =>
    {
        if (task.category == category)
        {
            tasksHistorySC.push(task);
        }    
    });

    var randomIndex = Math.floor(Math.random() * tasksHistorySC.length);
    var baseTask = tasksHistorySC[randomIndex];

    var sameCategory = true;
    if (Math.random() < 0.7)
    {
        sameCategory = true;
    }
    else
    {
        sameCategory = false;
    }

    var otherTask = null;

    if(sameCategory)
    {
        randomIndex = Math.floor(Math.random() * tasksHistorySC.length);
        otherTask = tasksHistorySC[randomIndex];
    }
    else
    {
        randomIndex = Math.floor(Math.random() * tasksHistory.length);
        otherTask = tasksHistory[randomIndex];
    }

    var text = baseTask.text;
    var importance = crossImportance(baseTask, otherTask)
    var date = crossDate(baseTask, otherTask);
    var color = crossColor(baseTask, otherTask);

    return new Task(text, importance, date, color, category, -2, false, new Date());
}

function getUniqueTasks(taskHistory)
{
    const uniqueTexts = new Set();
    
    const uniqueTasks = taskHistory.filter(task =>
    {
        if (!uniqueTexts.has(task.text))
            {
            uniqueTexts.add(task.text);
            return true;
        }
        return false;
    });

    return uniqueTasks;
}

function crossImportance(baseTask, otherTask)
{
    importanceLB = Math.min(baseTask.importance, otherTask.importance) - 1;
    importanceUB = Math.max(baseTask.importance, otherTask.importance) + 1;

    if (importanceLB < 0)
    {
        importanceLB = 0;
    }
    if (importanceUB > 10)
    {
        importanceUB = 10;
    }

    return getRandomInt(importanceLB, importanceUB);
}

function crossDate(baseTask, otherTask)
{
    var daysOutBase = daysApart(baseTask.creationDate, baseTask.date);
    var daysOutOther = daysApart(otherTask.creationDate, otherTask.date);
    var deviation = Math.floor(Math.abs(daysOutBase - daysOutOther)/2)

    var daysOutFinalLB = Math.min(daysOutBase, daysOutOther) - deviation;
    var daysOutFinalUB = Math.max(daysOutBase, daysOutOther) + deviation;

    if (daysOutFinalLB < 0)
    {
        daysOutFinalLB = 0;
    }

    var daysOutFinal = getRandomInt(daysOutFinalLB, daysOutFinalUB);

    var currentDate = new Date();
    var finalDate = new Date(currentDate);
    finalDate.setDate(currentDate.getDate() + daysOutFinal);

    return finalDate;
}

function getRandomInt(a, b)
{
    return Math.floor(Math.random() * (b - a)) + a;
}

function daysApart(date1, date2)
{
    const timeDifference = Math.abs(date2 - date1);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(timeDifference / millisecondsPerDay);
}

function crossColor(baseTask, otherTask)
{
    color1 = baseTask.color;
    color2 = otherTask.color;
    
    const r = Math.floor(Math.random() * (Math.max(color1.r, color2.r) - Math.min(color1.r, color2.r) + 1)) + Math.min(color1.r, color2.r);
    const g = Math.floor(Math.random() * (Math.max(color1.g, color2.g) - Math.min(color1.g, color2.g) + 1)) + Math.min(color1.g, color2.g);
    const b = Math.floor(Math.random() * (Math.max(color1.b, color2.b) - Math.min(color1.b, color2.b) + 1)) + Math.min(color1.b, color2.b);
    const a = 1

    return new RGBA(r, g, b, a);
}