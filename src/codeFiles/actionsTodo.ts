import { addCategoryTodoLinkApi } from '../api/categories_todo-api.ts'
import {
  addTodoApi,
  deleteAllTodosApi,
  deleteTodoApi,
  getTodosFromApi,
  updateTodoApi,
} from '../api/todo-api.ts'
import { selectedCategoryId, setSelectedCategoryId } from './categories.ts'
import { getDateDiffFromToday } from './datedifference.ts'
import { loadingSpinner } from './documentID'
import {
  errorMessage,
  todoDateInput,
  todoElements,
  todoInput,
} from './documentID.ts'
import { createMessageUpdater } from './messages.ts'
import { renderTodos } from './showTodos.ts'
import type { ListElement } from './types.ts'

const messageUpdater = createMessageUpdater(errorMessage)

export async function renderApp() {
  if (!todoElements) {
    console.error('Todo container not found. Cannot render todos.')
    return
  }

  const todos = await getTodosFromApi()

  renderTodos({
    todoContainer: todoElements,
    todos,
    toggleTodo: toggleTodoDone,
    removeTodo: deleteTodo,
    dateDiff: getDateDiffFromToday,
    overdueUpdater: messageUpdater,
    errorUpdater: messageUpdater,
  })
}

export async function toggleTodoDone(id: number) {
  const todos: ListElement[] = await getTodosFromApi()
  const todoToUpdate = todos.find((todo) => todo.id === id)
  if (!todoToUpdate) {
    console.warn('todo not found')
    return
  }
  const response = await updateTodoApi(id, { done: !todoToUpdate.done })
  if (!response.ok) {
    throw new Error(`Failed to update todo: ${response.status}`)
  }
  await renderApp()
}

export function resetInputs() {
  if (todoInput) todoInput.value = ''
  if (todoDateInput) todoDateInput.value = ''
}

export async function deleteTodo(id: number) {
  showLoading()
  try {
    await deleteTodoApi(id)
    await renderApp()
  } catch (error) {
    console.error('Error deleting todo:', error)
    messageUpdater.update('Error deleting todo')
  } finally {
    hideLoading()
  }
}

export async function deleteAllTodo() {
  showLoading()
  try {
    await deleteAllTodosApi()
    await renderApp()
  } catch (error) {
    console.error('Error deleting all todos:', error)
    messageUpdater.update('Error deleting all todos')
  } finally {
    hideLoading()
  }
}

export async function addTodo() {
  if (!todoInput || !todoElements || !todoDateInput) return
  messageUpdater.clear()
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
      todoDateInput.value = ''
      return
    }
  }
  const newTodo: ListElement = {
    title: task,
    content: task,
    done: false,
    due_date: dueDate || null,
  }

  showLoading()
  try {
    const createdTodo = await addTodoApi(newTodo)
    const newTodoId = createdTodo.id

    if (selectedCategoryId != null && newTodoId != null) {
      await addCategoryTodoLinkApi(selectedCategoryId, newTodoId)
    }
    setSelectedCategoryId(null)
    todoInput.value = ''
    todoDateInput.value = ''
    messageUpdater.clear()

    await renderApp()
  } catch (error) {
    console.error('Error:', error)
    messageUpdater.update('Error saving todo')
  } finally {
    hideLoading()
  }
}

function showLoading() {
  loadingSpinner?.classList.add('visible')
}

function hideLoading() {
  loadingSpinner?.classList.remove('visible')
}
