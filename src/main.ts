import './style.css'

const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const addButton = document.getElementById('add-todo-button')
const todoElements = document.getElementById('todo-elements')
const errorMessage = document.getElementById('error-message')
const deleteAllButton = document.getElementById('delete-all')
const todoDateInput =
  document.querySelector<HTMLInputElement>('#todo-date-input')
const overdueMessage = document.getElementById('overdue-message')
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
          typeof todo.element === 'string' &&
          typeof todo.done === 'boolean' &&
          typeof todo.dueDate === 'string',
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

function deleteTodo(index: number) {
  const todos = getTodos()
  todos.splice(index, 1)
  saveTodos(todos)
  renderTodos()
}

function deleteAllTodo() {
  saveTodos([])
  renderTodos()
}

function renderTodos() {
  if (!todoElements) return
  todoElements.innerHTML = ''
  const todos = getTodos()
  let isOverdue = false

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

    const dueDateElement = document.createElement('time')
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate)
      const today = new Date()

      dueDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)

      const dayDiff = Math.floor(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      )

      dueDateElement.dateTime = todo.dueDate
      dueDateElement.textContent = todo.dueDate

      if (dayDiff < 0) {
        dueDateElement.classList.add('due-past')
        if (!todo.done) {
          isOverdue = true
        }
      }
      if (dayDiff === 0) {
        dueDateElement.classList.add('due-today')
      } else if (dayDiff >= 1 && dayDiff <= 4) {
        dueDateElement.classList.add('due-soon')
      } else if (dayDiff > 4) {
        dueDateElement.classList.add('due-later')
      }
    } else {
      dueDateElement.textContent = 'no due date'
    }
    const controlGroup = document.createElement('div')
    controlGroup.classList.add('todo-controls')
    controlGroup.appendChild(checkbox)
    controlGroup.appendChild(status)

    const removeButton = document.createElement('button')
    removeButton.textContent = 'remove'
    removeButton.classList.add('remove-button')
    removeButton.addEventListener('click', () => {
      deleteTodo(index)
      clearError()
    })

    const removeAndDate = document.createElement('div')
    removeAndDate.classList.add('remove-and-date')
    removeAndDate.appendChild(removeButton)
    removeAndDate.appendChild(dueDateElement)

    const text = document.createElement('span')
    text.textContent = todo.element
    text.classList.add('todo-text')

    if (todo.done) {
      li.classList.add('completed')
    }

    li.appendChild(controlGroup)
    li.appendChild(text)
    li.appendChild(removeAndDate)

    todoElements.appendChild(li)
  })
  if (isOverdue) {
    displayOverdueError()
  } else {
    if (overdueMessage) {
      overdueMessage.textContent = ''
    }
  }
}

interface ListElement {
  element: string
  done: boolean
  dueDate: string
}

function displayError() {
  if (errorMessage) {
    errorMessage.textContent = 'Please enter a task with a valid date!'
  }
  if (todoDateInput && todoInput) {
    todoDateInput.value = ''
    todoInput.value = ''
  }
}

function displayOverdueError() {
  if (overdueMessage) {
    overdueMessage.textContent = 'OVERDUE TASK'
  }
}
function clearError() {
  if (errorMessage && overdueMessage) {
    errorMessage.textContent = ''
    overdueMessage.textContent = ''
  }
}
function addTodo() {
  if (!todoInput || !todoElements || !todoDateInput) return
  const task = todoInput.value.trim()
  const dueDate = todoDateInput.value
  if (task === '') {
    displayError()
    return
  }
  if (dueDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const userDueDate = new Date(`${dueDate}T00:00:00`)
    if (userDueDate < today) {
      displayError()
      return
    }
  }

  const todos = getTodos()
  todos.push({ element: task, done: false, dueDate: dueDate })
  saveTodos(todos)
  todoInput.value = ''
  todoDateInput.value = ''
  clearError()
  renderTodos()
}

if (
  !todoInput ||
  !addButton ||
  !todoElements ||
  !errorMessage ||
  !deleteAllButton
) {
  throw new Error('Critical UI elements are missing. The app cannot start.')
}
addButton.addEventListener('click', addTodo)
todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo()
  }
})
deleteAllButton?.addEventListener('click', deleteAllTodo)
renderTodos()
