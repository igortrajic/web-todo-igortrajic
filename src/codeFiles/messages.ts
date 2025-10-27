export function createMessageUpdater(element: HTMLElement) {
  return {
    update: (message: string) => {
      element.textContent = message
    },
    clear: () => {
      element.textContent = ''
    },
  }
}
