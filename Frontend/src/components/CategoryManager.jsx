import { useEffect, useState } from 'react'
import './CategoryManager.css'

const CATEGORIES_URL = 'http://localhost:8000/api/categories'

export default function CategoryManager({ onClose, onChanged }) {
  const [categories, setCategories] = useState(null)
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [error, setError] = useState('')

  async function loadCategories() {
    try {
      const response = await fetch(CATEGORIES_URL)
      if (!response.ok) {
        throw new Error(`API недоступно (код ${response.status})`)
      }
      setCategories(await response.json())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleAdd() {
    setError('')
    if (name.trim() === '') {
      return
    }

    try {
      const response = await fetch(CATEGORIES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Не удалось добавить категорию')
        return
      }

      setName('')
      await loadCategories()
      onChanged()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete() {
    setError('')
    if (selectedId === null) {
      return
    }

    try {
      const response = await fetch(`${CATEGORIES_URL}/${selectedId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Не удалось удалить категорию')
        return
      }

      setSelectedId(null)
      await loadCategories()
      onChanged()
    } catch (e) {
      setError(e.message)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    handleAdd()
  }

  return (
    <form className="category-manager" onSubmit={handleSubmit}>
      <h2>Управление категориями</h2>

      {error && <p className="category-error">Ошибка: {error}</p>}

      {categories === null ? (
        <p>Загрузка…</p>
      ) : categories.length === 0 ? (
        <p>Категорий пока нет.</p>
      ) : (
        <ul className="category-list">
          {categories.map((category) => (
            <li
              key={category.id}
              className={selectedId === category.id ? 'selected' : ''}
              onClick={() => setSelectedId(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      )}

      <label className="category-field">
        Название
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
        />
      </label>

      <div className="category-actions">
        <button type="submit">Добавить</button>
        <button type="button" onClick={handleDelete}>
          Удалить
        </button>
        <button type="button" onClick={onClose} className="category-close">
          Закрыть
        </button>
      </div>
    </form>
  )
}
