import type { ListElement } from '../codeFiles/todos/types'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'

export async function getTodosFromApi(): Promise<ListElement[]> {
  const response = await fetch(
    'https://api.todos.in.jt-lab.ch/todos?select=*,categories_todos(categories(title,color))',
  )
  const todos = await response.json()
  return todos
}

export async function addTodoApi(todo: ListElement): Promise<ListElement> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create todo: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const createdTodo = Array.isArray(data) ? data[0] : data

  if (!createdTodo?.id) {
    throw new Error('Todo created but no id returned')
  }

  return createdTodo
}

export async function updateTodoApi(
  id: number,
  updatedFields: Partial<ListElement>,
): Promise<Response> {
  return await fetch(`${API_URL}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  })
}

export async function deleteTodoApi(id: number): Promise<Response> {
  return await fetch(`${API_URL}?id=eq.${id}`, {
    method: 'DELETE',
  })
}

export async function deleteAllTodosApi(): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'DELETE',
  })
  if (response.ok) {
    return
  }
}
