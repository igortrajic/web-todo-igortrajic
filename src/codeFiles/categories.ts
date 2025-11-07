import {
  addCategoryApi,
  deleteAllCategoriesApi,
  deleteCategoryApi,
  getCategoriesFromApi,
  updateCategoryApi,
} from '../api/category-api'
import {
  addCategoryButton,
  categoryColor,
  categoryList,
  categoryModal,
  categoryName,
  deleteAllCategoriesButton,
  errorMessageCategory,
} from './documentID'
import type { CategoryElement } from './types'

let editingCategoryId: number | null = null

export async function addCategory() {
  if (!categoryName || !categoryColor) return
  const nameValue = categoryName.value.trim()
  const colorValue = categoryColor.value

  if (nameValue === '') {
    errorMessageCategory.textContent = 'Please enter a category name'
    return
  }

  errorMessageCategory.textContent = ''

  if (editingCategoryId === null) {
    await addCategoryApi({ title: nameValue, color: colorValue })
  } else {
    await updateCategoryApi(editingCategoryId, {
      title: nameValue,
      color: colorValue,
    })
  }

  const categories = await getCategoriesFromApi()
  if (categoryList) {
    renderCategory({ categoryContainer: categoryList, category: categories })
  }

  categoryName.value = ''
  categoryColor.value = '#000000'
  addCategoryButton.textContent = 'Add Category'
  setDeleteAllDefault()
  editingCategoryId = null
}

export interface RenderCategoryDeps {
  categoryContainer: HTMLElement
  category: CategoryElement[]
}

export async function deleteCategory(id: number) {
  await deleteCategoryApi(id)
  const categories = await getCategoriesFromApi()
  if (categoryList) {
    renderCategory({ categoryContainer: categoryList, category: categories })
  }
}

export async function deleteAllCategories() {
  await deleteAllCategoriesApi()
  const categories = await getCategoriesFromApi()
  if (categoryList) {
    renderCategory({ categoryContainer: categoryList, category: categories })
  }
}

export function renderCategory({
  categoryContainer,
  category,
}: RenderCategoryDeps) {
  categoryContainer.innerHTML = ''

  category.forEach((item) => {
    const li = document.createElement('li')
    li.textContent = item.title
    li.style.background = item.color + 60

    const removeCategory = document.createElement('button')
    removeCategory.textContent = 'remove'
    removeCategory.classList.add('remove-button')
    removeCategory.addEventListener('click', () => {
      if (item.id !== undefined) {
        deleteCategory(item.id)
      }
    })

    const editCategory = document.createElement('button')
    editCategory.textContent = 'edit'
    editCategory.classList.add('edit-button')
    editCategory.addEventListener('click', () => {
      if (!categoryName || !categoryColor || !deleteAllCategoriesButton) return
      if (item.id === undefined) return

      editingCategoryId = item.id
      categoryName.value = item.title
      categoryColor.value = item.color

      addCategoryButton.textContent = 'Save changes'
      deleteAllCategoriesButton.textContent = 'Cancel'

      deleteAllCategoriesButton.onclick = () => {
        editingCategoryId = null
        if (categoryName) categoryName.value = ''
        if (categoryColor) categoryColor.value = '#000000'
        addCategoryButton.textContent = 'Add Category'
        setDeleteAllDefault()
      }

      categoryModal.classList.remove('hidden')
    })

    const buttonGroup = document.createElement('div')
    buttonGroup.classList.add('category-buttons')
    buttonGroup.appendChild(editCategory)
    buttonGroup.appendChild(removeCategory)
    li.appendChild(buttonGroup)
    categoryContainer.appendChild(li)
  })
}

function setDeleteAllDefault() {
  if (!deleteAllCategoriesButton) return
  deleteAllCategoriesButton.textContent = 'Delete All'
  deleteAllCategoriesButton.onclick = async () => {
    await deleteAllCategories()
  }
}

setDeleteAllDefault()
