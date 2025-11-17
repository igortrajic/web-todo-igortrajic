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
  closeCategoryModalButton,
  closeSelectCategory,
  deleteAllCategoriesButton,
  errorMessageCategory,
  openCategoryModalButton,
  openSelectCategory,
  selectCategoryList,
  selectCategoryModal,
} from './documentID'
import type { CategoryElement } from './types'

export let selectedCategoryId: number | null = null
export function setSelectedCategoryId(id: number | null) {
  selectedCategoryId = id
}

let editingCategoryId: number | null = null

function resetCategoryForm() {
  editingCategoryId = null
  if (categoryName) categoryName.value = ''
  if (categoryColor) categoryColor.value = '#000000'
  addCategoryButton.textContent = 'Add Category'
  setDeleteAllDefault()
}

function getContrastColor(hexColor: string): string {
  const color = hexColor.replace('#', '')

  const r = Number.parseInt(color.substring(0, 2), 16)
  const g = Number.parseInt(color.substring(2, 4), 16)
  const b = Number.parseInt(color.substring(4, 6), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

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
  resetCategoryForm()
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
    li.style.background = item.color
    li.style.color = getContrastColor(item.color)

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
        resetCategoryForm()
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

;(async () => {
  const categories = await getCategoriesFromApi()
  if (categoryList) {
    renderCategory({ categoryContainer: categoryList, category: categories })
  }
})()

openCategoryModalButton.addEventListener('click', () => {
  categoryModal.classList.remove('hidden')
})

closeCategoryModalButton.addEventListener('click', () => {
  categoryModal.classList.add('hidden')
})

addCategoryButton.addEventListener('click', addCategory)

openSelectCategory.addEventListener('click', async () => {
  selectCategoryModal.classList.remove('hidden')

  const categories = await getCategoriesFromApi()

  selectCategoryList.innerHTML = ''

  categories.forEach((category) => {
    const li = document.createElement('li')
    li.textContent = category.title
    li.style.backgroundColor = category.color
    li.style.color = getContrastColor(category.color)
    li.addEventListener('click', () => {
      if (category.id === undefined) return
      setSelectedCategoryId(category.id)
      selectCategoryModal.classList.add('hidden')
    })
    selectCategoryList.appendChild(li)
  })
})

closeSelectCategory.addEventListener('click', () => {
  selectCategoryModal.classList.add('hidden')
})
