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
    const importance = Math.floor(Math.random() * 10) + 1;
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

