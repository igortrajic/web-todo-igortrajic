import './style.css'

import { categoryFilterDropdown } from './codeFiles/categories/filterCategory'
import {
  addTodo,
  deleteAllTodo,
  renderApp,
} from './codeFiles/todos/actionsTodo'
import {
  addButton,
  addCategoryButton,
  categoryFilter,
  closeCategoryModalButton,
  deleteAllButton,
  errorMessage,
  openCategoryModalButton,
  todoElements,
  todoInput,
} from './codeFiles/todos/documentID'

categoryFilterDropdown()

if (
  !todoInput ||
  !addButton ||
  !todoElements ||
  !errorMessage ||
  !deleteAllButton ||
  !addCategoryButton ||
  !openCategoryModalButton ||
  !closeCategoryModalButton
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
renderApp()

categoryFilter?.addEventListener('change', () => {
  renderApp()
})
