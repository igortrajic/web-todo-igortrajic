export const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
export const addButton = document.getElementById('add-todo-button')
export const todoElements = document.getElementById('todo-elements')
export const errorMessage = document.getElementById(
  'error-message',
) as HTMLElement
export const deleteAllButton = document.getElementById('delete-all')
export const todoDateInput =
  document.querySelector<HTMLInputElement>('#todo-date-input')
export const overdueMessage = document.getElementById(
  'overdue-message',
) as HTMLElement
export const loadingSpinner = document.getElementById('loading-spinner')
export const openCategoryModalButton = document.getElementById(
  'open-category-modal',
) as HTMLButtonElement
export const closeCategoryModalButton = document.getElementById(
  'close-category-modal',
) as HTMLButtonElement
export const categoryModal = document.getElementById(
  'category-modal',
) as HTMLElement
export const categoryName =
  document.querySelector<HTMLInputElement>('#category-name')
export const categoryColor =
  document.querySelector<HTMLInputElement>('#category-color')
export const categoryList = document.getElementById(
  'categories-elements',
) as HTMLElement
export const addCategoryButton = document.getElementById(
  'add-category',
) as HTMLButtonElement
export const deleteAllCategoriesButton = document.getElementById(
  'delete-all-categories',
) as HTMLButtonElement
export const errorMessageCategory = document.getElementById(
  'error-message-category',
) as HTMLElement
