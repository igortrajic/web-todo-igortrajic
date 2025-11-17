const API_URL = 'https://api.todos.in.jt-lab.ch/categories_todos'

export interface CategoryTodoLink {
  category_id: number
  todo_id: number
}

export async function addCategoryTodoLinkApi(
  categoryId: number,
  todoId: number,
): Promise<CategoryTodoLink> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      category_id: categoryId,
      todo_id: todoId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to link category and todo: ${response.status} - ${errorText}`,
    )
  }

  const data = await response.json()
  return data
}
