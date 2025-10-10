import './style.css'

const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const addButton = document.getElementById('add-todo-button')
const todoElements = document.getElementById('todo-elements')
const errorMessage = document.getElementById('error-message')

const STORAGE_KEY = 'todo-list'

function saveTodos(todos: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function getTodos(): string[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

function renderTodos() {
  if (!todoElements) return
  todoElements.innerHTML = ''
  const todos = getTodos()
  todos.forEach((task) => {
    const li = document.createElement('li')
    li.textContent = task
    todoElements.appendChild(li)
  })
}

function displayError() {
  if (errorMessage) {
    errorMessage.textContent = 'Please enter a task!'
  }
}
function clearError() {
  if (errorMessage) {
    errorMessage.textContent = ''
  }
}
function addTodo() {
  if (!todoInput || !todoElements) return
  const task = todoInput.value.trim()
  if (task === '') {
    displayError()
  } else {
    const todos = getTodos()
    todos.push(task)
    saveTodos(todos)
    todoInput.value = ''
    clearError()
    renderTodos()
  }
}

if (addButton && todoInput && todoElements) {
  addButton.addEventListener('click', addTodo)
  todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  })
  renderTodos()
}
