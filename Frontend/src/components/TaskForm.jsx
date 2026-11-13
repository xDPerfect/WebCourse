import { useEffect, useState } from 'react'
import './TaskForm.css'

const DICTIONARIES_URL = 'http://localhost:8000/api/dictionaries'
const TASKS_URL = 'http://localhost:8000/api/tasks'

export default function TaskForm({ editingTask, dictVersion, onCancel, onSaved, onManageCategories, onManageTags }) {
  const [dictionaries, setDictionaries] = useState(null)
  const [dictError, setDictError] = useState('')

  const [name, setName] = useState(editingTask?.name ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [priorityId, setPriorityId] = useState(editingTask?.priority_id ?? '')
  const [statusId, setStatusId] = useState(editingTask?.status_id ?? '')
  const [categoryId, setCategoryId] = useState(editingTask?.category_id ?? '')
  const [tagIds, setTagIds] = useState(
    editingTask ? editingTask.task_tags.map((taskTag) => taskTag.tag_id) : []
  )

  const [errors, setErrors] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(DICTIONARIES_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сервера (код ${response.status})`)
        }
        return response.json()
      })
      .then((data) => setDictionaries(data))
      .catch((e) => setDictError(e.message))
  }, [dictVersion])

  const priorities = dictionaries ? dictionaries.priorities : []
  const statuses = dictionaries ? dictionaries.statuses : []
  const categories = dictionaries ? dictionaries.categories : []
  const tags = dictionaries ? dictionaries.tags : []

  function toggleTag(event, tagId) {
    if (event.target.checked) {
      setTagIds([...tagIds, tagId])
    } else {
      setTagIds(tagIds.filter((id) => id !== tagId))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setErrors([])

    try {
      const url = editingTask ? `${TASKS_URL}/${editingTask.id}` : TASKS_URL
      const response = await fetch(url, {
        method: editingTask ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          description: description || null,
          priority_id: Number(priorityId),
          status_id: Number(statusId),
          category_id: Number(categoryId),
          tag_ids: tagIds,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        const messages = []
        for (const key in data.errors ?? {}) {
          for (const message of data.errors[key]) {
            messages.push(message)
          }
        }
        setErrors(messages)
        return
      }

      onSaved()
    } catch (e) {
      setErrors([e.message])
    } finally {
      setSaving(false)
    }
  }

  if (dictError) {
    return <p className="task-form-error">Не удалось загрузить справочники: {dictError}</p>
  }

  if (!dictionaries) {
    return <p>Загрузка…</p>
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Редактирование задачи' : 'Новая задача'}</h2>

      {errors.length > 0 && (
        <ul className="task-form-errors">
          {errors.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}

      <label className="task-form-field">
        Название *
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
          required
        />
      </label>

      <label className="task-form-field">
        Описание
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <div className="task-form-row">
        <label className="task-form-field">
          Приоритет *
          <select
            value={priorityId}
            onChange={(e) => setPriorityId(e.target.value)}
            required
          >
            <option value="">— выберите —</option>
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="task-form-field">
          Статус *
          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            required
          >
            <option value="">— выберите —</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="task-form-row">
        <label className="task-form-field">
          Категория *
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">— выберите —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={onManageCategories}>
          Управление категориями
        </button>
      </div>

      <fieldset className="task-form-tags">
        <legend>Теги</legend>
        {tags.length === 0 ? (
          <p className="task-form-hint">Тегов пока нет.</p>
        ) : (
          <ul className="task-form-tags-list">
            {tags.map((t) => (
              <li key={t.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={tagIds.includes(t.id)}
                    onChange={(e) => toggleTag(e, t.id)}
                  />
                  {t.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className="task-form-row">
        <button type="button" onClick={onManageTags}>
          Управление тегами
        </button>

        <div className="task-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
          <button type="button" onClick={onCancel} disabled={saving}>
            Отмена
          </button>
        </div>
      </div>
    </form>
  )
}
