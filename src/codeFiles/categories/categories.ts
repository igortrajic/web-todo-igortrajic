import { getCategoriesFromApi } from '../../api/category-api'
import {
  addCategoryButton,
  categoryColor,
  categoryList,
  categoryModal,
  categoryName,
  closeCategoryModalButton,
  closeSelectCategory,
  deleteAllCategoriesButton,
  openCategoryModalButton,
  openSelectCategory,
  selectCategoryList,
  selectCategoryModal,
} from '../todos/documentID'
import type { CategoryElement } from '../todos/types'
import {
  addCategory,
  deleteAllCategories,
  deleteCategory,
} from './actionsCategory'
import { getContrastColor } from './contrastColor'

export let selectedCategoryId: number | null = null
export function setSelectedCategoryId(id: number | null) {
  selectedCategoryId = id
}

export let editingCategoryId: number | null = null

export function resetCategoryForm() {
  editingCategoryId = null
  if (categoryName) categoryName.value = ''
  if (categoryColor) categoryColor.value = '#000000'
  addCategoryButton.textContent = 'Add Category'
  setDeleteAllDefault()
}

export function setDeleteAllDefault() {
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

export interface RenderCategoryDeps {
  categoryContainer: HTMLElement
  category: CategoryElement[]
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
