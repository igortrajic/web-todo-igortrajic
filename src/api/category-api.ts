import type { CategoryElement } from '../codeFiles/types'

const API_URL = 'https://api.todos.in.jt-lab.ch/categories'

export async function getCategoriesFromApi(): Promise<CategoryElement[]> {
  const response = await fetch(API_URL)
  const categories = await response.json()
  return categories
}

export async function addCategoryApi(
  category: CategoryElement,
): Promise<CategoryElement> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(category),
  })

  const data = await response.json()
  return data
}

export async function deleteCategoryApi(id: number): Promise<Response> {
  return await fetch(`${API_URL}?id=eq.${id}`, {
    method: 'DELETE',
  })
}

export async function deleteAllCategoriesApi(): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'DELETE',
  })
  if (response.ok) {
    return
  }
}

export async function updateCategoryApi(
  id: number,
  updatedFields: Partial<CategoryElement>,
): Promise<Response> {
  return await fetch(`${API_URL}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  })
}
