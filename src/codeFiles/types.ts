export interface ListElement {
  id?: number
  title: string
  content: string
  done: boolean
  due_date: string | null

  categories_todos?: {
    categories: {
      title: string
      color: string
    }
  }[]
}

export interface CategoryElement {
  id?: number
  title: string
  color: string
}
