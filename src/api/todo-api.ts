import type { ListElement } from '../codeFiles/types'

export async function getTodosFromApi(): Promise<ListElement[]> {
  const response = await fetch('https://api.todos.in.jt-lab.ch/todos')
  const todos = await response.json()
  return todos
}
const API_URL = 'https://api.todos.in.jt-lab.ch/todos'

export async function addTodoApi(todo: ListElement): Promise<Response> {
  return await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  })
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
  const todos = await getTodosFromApi()
  for (const todo of todos) {
    if (todo.id !== undefined) {
      await deleteTodoApi(todo.id)
    }
  }
}
