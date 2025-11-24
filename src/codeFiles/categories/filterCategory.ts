import { getCategoriesFromApi } from '../../api/category-api'
import { categoryFilter } from '../todos/documentID'

export async function categoryFilterDropdown() {
  const categories = await getCategoriesFromApi()
  if (!categoryFilter) return

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'

  categories.forEach((cat) => {
    const option = document.createElement('option')
    option.value = String(cat.id)
    option.textContent = cat.title
    categoryFilter?.appendChild(option)
  })
}
