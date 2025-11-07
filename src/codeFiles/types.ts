export interface ListElement {
  id?: number
  title: string
  content: string
  done: boolean
  due_date: string | null
}

export interface CategoryElement {
  id?: number
  title: string
  color: string
}
