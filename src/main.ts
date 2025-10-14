import './style.css'

const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const addButton = document.getElementById('add-todo-button')
const todoElements = document.getElementById('todo-elements')
const errorMessage = document.getElementById('error-message')

const STORAGE_KEY = 'todo-list'

function saveTodos(todos: ListElement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function getTodos(): ListElement[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return []
  try {
    const todos: unknown = JSON.parse(saved)
    if (Array.isArray(todos)) {
      return todos.filter(
        (todo) =>
          typeof todo.element === 'string' && typeof todo.done === 'boolean',
      ) as ListElement[]
    }
    return []
  } catch (e) {
    console.error('Failed to parse todos from localStorage:', e)
    return []
  }
}
function toggleTodoDone(index: number) {
  const todos = getTodos()
  todos[index].done = !todos[index].done
  saveTodos(todos)
  renderTodos()
}

function renderTodos() {
  if (!todoElements) return
  todoElements.innerHTML = ''
  const todos = getTodos()

  todos.forEach((todo, index) => {
    const li = document.createElement('li')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = todo.done
    checkbox.id = `todo-${index}`
    checkbox.addEventListener('change', () => {
      toggleTodoDone(index)
    })

    const status = document.createElement('span')
    status.classList.add('todo-status')

    if (todo.done) {
      status.textContent = 'completed'
    } else {
      status.textContent = ''
    }

    const controlGroup = document.createElement('div')
    controlGroup.classList.add('todo-controls')
    controlGroup.appendChild(checkbox)
    controlGroup.appendChild(status)

    function deleteTodo(index: number) {
      const todos = getTodos()
      todos.splice(index, 1)
      saveTodos(todos)
      renderTodos()
    }
    const removeButton = document.createElement('button')
    removeButton.textContent = 'remove'
    removeButton.classList.add('removebut')
    removeButton.addEventListener('click', () => {
      deleteTodo(index)
      clearError()
    })

    const text = document.createElement('span')
    text.textContent = todo.element
    text.classList.add('todo-text')

    if (todo.done) {
      li.classList.add('completed')
    }

    li.appendChild(controlGroup)
    li.appendChild(text)
    li.appendChild(removeButton)

    todoElements.appendChild(li)
  })
}

interface ListElement {
  element: string
  done: boolean
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
    todos.push({ element: task, done: false })
    saveTodos(todos)
    todoInput.value = ''
    clearError()
    renderTodos()
  }
}
if (!todoInput || !addButton || !todoElements || !errorMessage) {
  throw new Error('Critical UI elements are missing. The app cannot start.')
}
addButton.addEventListener('click', addTodo)
todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo()
  }
})
renderTodos()
