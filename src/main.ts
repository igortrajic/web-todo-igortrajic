import './style.css'

import { getCategoriesFromApi } from './api/category-api'
import { addTodo, deleteAllTodo, renderApp } from './codeFiles/actionsTodo'
import { addCategory, renderCategory } from './codeFiles/categories'
import {
  addButton,
  addCategoryButton,
  categoryList,
  categoryModal,
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
renderApp()

openCategoryModalButton.addEventListener('click', () => {
  categoryModal.classList.remove('hidden')
})

const categories = await getCategoriesFromApi()
if (categoryList) {
  renderCategory({ categoryContainer: categoryList, category: categories })
}

closeCategoryModalButton.addEventListener('click', () => {
  categoryModal.classList.add('hidden')
})

addCategoryButton.addEventListener('click', addCategory)
