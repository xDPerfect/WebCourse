import { useEffect, useState } from 'react'
import Task from './Task.jsx'
import './TaskList.css'

const API_URL = 'http://localhost:8000/api/tasks'

export default function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  async function loadTasks() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Ошибка сервера (код ${response.status})`)
      }
      setTasks(await response.json())
    } catch (e) {
      setLoadError(e.message)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleDelete(task) {
    setDeleteError('')

    try {
      const response = await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json()
        setDeleteError(data.message || 'Не удалось удалить задачу')
        return
      }

      loadTasks()
    } catch (e) {
      setDeleteError(e.message)
    }
  }

  if (loadError) {
    return <p className="task-error">Не удалось загрузить задачи: {loadError}</p>
  }

  if (tasks === null) {
    return <p>Загрузка…</p>
  }

  if (tasks.length === 0) {
    return <p>Задач пока нет.</p>
  }

  return (
    <section className="task-list">
      {deleteError && <p className="task-error">Ошибка: {deleteError}</p>}
      {tasks.map((task) => (
        <Task key={task.id} task={task} onEdit={onEdit} onDelete={handleDelete} />
      ))}
    </section>
  )
}
