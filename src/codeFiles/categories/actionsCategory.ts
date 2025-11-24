import {
  addCategoryApi,
  deleteAllCategoriesApi,
  deleteCategoryApi,
  getCategoriesFromApi,
  updateCategoryApi,
} from '../../api/category-api'
import {
  categoryColor,
  categoryList,
  categoryName,
  errorMessageCategory,
} from '../todos/documentID'

import {
  editingCategoryId,
  renderCategory,
  resetCategoryForm,
} from './categories'
import { categoryFilterDropdown } from './filterCategory'

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
  categoryFilterDropdown()
}
