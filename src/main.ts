import './style.css'

const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const addButton = document.getElementById('add-todo-button')
const todoElements = document.getElementById('todo-elements')
const errorMessage = document.getElementById('error-message')
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
    const newItem = document.createElement('li')
    newItem.textContent = task
    todoElements.appendChild(newItem)
    todoInput.value = ''
    clearError()
  }
}

if (addButton && todoInput && todoElements) {
  addButton.addEventListener('click', addTodo)
  todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  })
}
