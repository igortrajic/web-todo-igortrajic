import './style.css'

import { addTodo, deleteAllTodo, renderApp } from './codeFiles/actionsTodo'
import {
  addButton,
  addCategoryButton,
  closeCategoryModalButton,
  deleteAllButton,
  errorMessage,
  openCategoryModalButton,
  todoElements,
  todoInput,
} from './codeFiles/documentID'

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
