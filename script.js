class Task {
    constructor(id, text, done = false) {
        this.id = id;
        this.text = text;
        this.done = done;
    }
    toggleDone() {
        this.done = !this.done;
    }
    getInfo() {
        return `${this.text} (ID: ${this.id}, Done: ${this.done})`;
    }
}

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.render(); 
        this.bindEvents()
    }
    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        if (text) {
            const task = new Task(this.tasks.length + 1, text);
            this.tasks.push(task);
            input.value = '';
            this.saveTasks();
            this.render();
        }
    }
    bindEvents(){
        const input = document.getElementById('taskInput');
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.addTask();
            }
        })
    }
    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) task.toggleDone();
        this.saveTasks();
        this.render();
    }
    filterDoneTasks() {
        const filteredTasks = this.tasks.filter(task => task.done);
        this.render(filteredTasks);
    }
    resetFilter() {
        this.render();
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            return parsedTasks.map(task => {
                return new Task(task.id, task.text, task.done);
            });
        }
        return [];
    }
    render(filteredTasks = this.tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.done ? 'done' : ''}`;
            taskDiv.innerHTML = `
                <span onclick="taskManager.toggleTask(${task.id})">${task.getInfo()}</span>
                <button onclick="taskManager.removeTask(${task.id})">Удалить</button>
            `;
            taskList.appendChild(taskDiv);
        });
    }
}

const taskManager = new TaskManager();