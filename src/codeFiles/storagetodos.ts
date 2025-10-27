interface StorageProvider {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ListElement {
  element: string
  done: boolean
  dueDate: string
}

const STORAGE_KEY = 'todo-list'

export function saveTodos(
  todos: ListElement[],
  storage: StorageProvider = localStorage,
) {
  storage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function getTodos(
  storage: StorageProvider = localStorage,
): ListElement[] {
  const saved = storage.getItem(STORAGE_KEY)
  if (!saved) return []

  try {
    const todos: unknown = JSON.parse(saved)
    if (Array.isArray(todos)) {
      return todos.filter(
        (todo) =>
          typeof todo.element === 'string' &&
          typeof todo.done === 'boolean' &&
          typeof todo.dueDate === 'string',
      ) as ListElement[]
    }
    return []
  } catch (e) {
    console.error('Failed to parse todos:', e)
    return []
  }
}
