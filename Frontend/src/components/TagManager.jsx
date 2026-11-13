import { useEffect, useState } from 'react'
import './TagManager.css'

const TAGS_URL = 'http://localhost:8000/api/tags'

export default function TagManager({ onClose, onChanged }) {
  const [tags, setTags] = useState(null)
  const [name, setName] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [error, setError] = useState('')

  async function loadTags() {
    try {
      const response = await fetch(TAGS_URL)
      if (!response.ok) {
        throw new Error(`API недоступно (код ${response.status})`)
      }
      setTags(await response.json())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    loadTags()
  }, [])

  async function handleAdd() {
    setError('')
    if (name.trim() === '') {
      return
    }

    try {
      const response = await fetch(TAGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Не удалось добавить тег')
        return
      }

      setName('')
      await loadTags()
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
      const response = await fetch(`${TAGS_URL}/${selectedId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Не удалось удалить тег')
        return
      }

      setSelectedId(null)
      await loadTags()
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
    <form className="tag-manager" onSubmit={handleSubmit}>
      <h2>Управление тегами</h2>

      {error && <p className="tag-error">Ошибка: {error}</p>}

      {tags === null ? (
        <p>Загрузка…</p>
      ) : tags.length === 0 ? (
        <p>Тегов пока нет.</p>
      ) : (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className={selectedId === tag.id ? 'selected' : ''}
              onClick={() => setSelectedId(tag.id)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <label className="tag-field">
        Название
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
        />
      </label>

      <div className="tag-actions">
        <button type="submit">Добавить</button>
        <button type="button" onClick={handleDelete}>
          Удалить
        </button>
        <button type="button" onClick={onClose} className="tag-close">
          Закрыть
        </button>
      </div>
    </form>
  )
}
