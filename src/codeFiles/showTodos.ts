import type { ListElement } from './storagetodos'

export interface MessageUpdater {
  update(message: string): void
  clear(): void
}

export interface RenderTodosDeps {
  todoContainer: HTMLElement
  todos: ListElement[]
  toggleTodo: (index: number) => void
  removeTodo: (index: number) => void
  dateDiff: (dateString: string, today?: Date) => number
  overdueUpdater: MessageUpdater
  errorUpdater: MessageUpdater
}

export function renderTodos({
  todoContainer,
  todos,
  toggleTodo,
  removeTodo,
  dateDiff,
  overdueUpdater,
  errorUpdater,
}: RenderTodosDeps) {
  todoContainer.innerHTML = ''
  let isOverdue = false

  todos.forEach((todo, index) => {
    const li = document.createElement('li')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = todo.done
    checkbox.id = `todo-${index}`
    checkbox.addEventListener('change', () => toggleTodo(index))

    const status = document.createElement('span')
    status.classList.add('todo-status')
    status.textContent = todo.done ? 'completed' : ''

    const dueDateElement = document.createElement('time')
    if (todo.dueDate) {
      const dayDiff = dateDiff(todo.dueDate)
      dueDateElement.dateTime = todo.dueDate
      dueDateElement.textContent = todo.dueDate

      if (dayDiff < 0) {
        dueDateElement.classList.add('due-past')
        if (!todo.done) isOverdue = true
      } else if (dayDiff === 0) {
        dueDateElement.classList.add('due-today')
      } else if (dayDiff >= 1 && dayDiff <= 4) {
        dueDateElement.classList.add('due-soon')
      } else {
        dueDateElement.classList.add('due-later')
      }
    } else {
      dueDateElement.textContent = 'no due date'
    }

    const controlGroup = document.createElement('div')
    controlGroup.classList.add('todo-controls')
    controlGroup.appendChild(checkbox)
    controlGroup.appendChild(status)

    const removeButton = document.createElement('button')
    removeButton.textContent = 'remove'
    removeButton.classList.add('remove-button')
    removeButton.addEventListener('click', () => {
      removeTodo(index)
      errorUpdater.clear()
    })

    const removeAndDate = document.createElement('div')
    removeAndDate.classList.add('remove-and-date')
    removeAndDate.appendChild(removeButton)
    removeAndDate.appendChild(dueDateElement)

    const text = document.createElement('span')
    text.textContent = todo.element
    text.classList.add('todo-text')

    if (todo.done) li.classList.add('completed')

    li.appendChild(controlGroup)
    li.appendChild(text)
    li.appendChild(removeAndDate)

    todoContainer.appendChild(li)
  })

  if (isOverdue) {
    overdueUpdater.update('TASK OVERDUE')
  } else {
    overdueUpdater.clear()
  }
}
