const CLEAR_TODOS_BTN = document.querySelector(".clear-todos")
const TODO_DONE = "fa-check-circle"
const TODO_PENDING = "fa-circle"
const TODO_OPACITY = "todo-is-done";
const time = document.querySelector(".time")
const userInput = document.querySelector(".todo-input")
const todoList = document.querySelector(".todo-list")
const todoArray = []
let id = 0;
class Todo {
    constructor(name, id, isDone = false, isDeleted = false) {
        this.todoName = name;
        this.id = id;
        this.isDone = isDone;
        this.isDeleted = isDeleted;
    }
}
CLEAR_TODOS_BTN.addEventListener("click", () => {
    localStorage.clear();
    document.location.reload(true);
})

function setLocalStorage(array, name) {
    localStorage.setItem(name, JSON.stringify(array));
}
window.addEventListener("load", () => {
    let todos = JSON.parse(localStorage.getItem("todoList"));
    if (todos === null) return;
    todos.forEach(element => {
        addTodo(element.todoName, element.id, element.isDone, element.isDeleted);
        todoArray.push(element)
    });
    id = todoArray.length;

})
document.body.addEventListener('keypress', (e) => {
    if (userInput.value === '') return;
    if (e.key === "Enter") {
        addTodo(userInput.value, id);
        let todo = new Todo(userInput.value, id);
        todoArray.push(todo);
        id++;
        userInput.value = ''
        setLocalStorage(todoArray, "todoList");
        console.log(todoArray);

    }

})
todoList.addEventListener("click", (e) => {
    let target = e.target;
    let targetJob = target.dataset.job;
    let parent = target.parentNode.parentNode;
    if (targetJob === "removeTodo") {
        todoArray[parent.dataset.id].isDeleted = true;
        setLocalStorage(todoArray, "todoList");
        removeTodo(target);
    } else if (targetJob === "checkTodo") {
        completeTodo(target);
        setLocalStorage(todoArray, "todoList");
    }
})

function completeTodo(target) {
    let parent = target.parentNode.parentNode;
    console.log(parent);
    target.classList.toggle(TODO_PENDING);
    target.classList.toggle(TODO_DONE);
    parent.classList.toggle(TODO_OPACITY);
    todoArray[parent.dataset.id].isDone = todoArray[parent.dataset.id].isDone ? false : true;
}

function removeTodo(target) {
    let parent = target.parentNode.parentNode.parentNode;
    let child = target.parentNode.parentNode;
    parent.removeChild(child);
}

function addTodo(name, id, isDone = false, isDeleted = false) {
    if (isDeleted === true) return;
    const pendingDone = isDone ? TODO_DONE : TODO_PENDING;
    const todoDoneClass = isDone ? TODO_OPACITY : '';
    todoList.insertAdjacentHTML("beforeend", `
    <li class="list-item ${todoDoneClass}" data-id="${id}" data-isdone="${isDone}">
        <div class="todo-item">
            <i class="far ${pendingDone}" data-job="checkTodo"></i>
            <h1 class="todo-title">${name}</h1>
            <img src="sources/bin.svg" class="remove-todo" width="25px" data-job="removeTodo">
        </div>
    </li> 
    `)
}

function showTime() {
    let date = new Date();
    let hour = date.getHours();
    let amPM = hour < 12 ? "AM" : "PM";
    hour = hour % 12;
    let min = date.getMinutes();
    let sec = date.getSeconds();
    time.textContent = `${hour}:${addZero(min)}:${addZero(sec)} ${amPM}`;
}
setInterval(showTime, 1000);

function addZero(n) {
    return n < 10 ? n = "0" + n : n;
}
showTime();