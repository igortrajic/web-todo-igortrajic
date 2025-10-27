import { getDateDiffFromToday } from './datedifference.ts'
import {
  errorMessage,
  todoDateInput,
  todoElements,
  todoInput,
} from './documentID.ts'
import { createMessageUpdater } from './messages.ts'
import { renderTodos } from './showTodos.ts'
import { getTodos, saveTodos } from './storagetodos.ts'

const messageUpdater = createMessageUpdater(errorMessage)

export function renderApp() {
  if (!todoElements) {
    console.error('Todo container not found. Cannot render todos.')
    return
  }

  renderTodos({
    todoContainer: todoElements,
    todos: getTodos(),
    toggleTodo: toggleTodoDone,
    removeTodo: deleteTodo,
    dateDiff: getDateDiffFromToday,
    overdueUpdater: messageUpdater,
    errorUpdater: messageUpdater,
  })
}

export function toggleTodoDone(index: number) {
  const todos = getTodos()
  todos[index].done = !todos[index].done
  saveTodos(todos)
  renderApp()
}

export function resetInputs() {
  if (todoInput) todoInput.value = ''
  if (todoDateInput) todoDateInput.value = ''
}

export function deleteTodo(index: number) {
  const todos = getTodos()
  todos.splice(index, 1)
  saveTodos(todos)
  renderApp()
}

export function deleteAllTodo() {
  saveTodos([])
  renderApp()
}

export function addTodo() {
  if (!todoInput || !todoElements || !todoDateInput) return
  const task = todoInput.value.trim()
  const dueDate = todoDateInput.value
  if (task === '') {
    messageUpdater.update('Please enter a task!')
    return
  }
  if (dueDate) {
    const dayDiff = getDateDiffFromToday(dueDate)
    if (dayDiff < 0) {
      messageUpdater.update('Due date cannot be in the past!')
      return
    }
  }

  const todos = getTodos()
  todos.push({ element: task, done: false, dueDate: dueDate })
  saveTodos(todos)
  resetInputs()
  messageUpdater.clear()
  renderApp()
}
