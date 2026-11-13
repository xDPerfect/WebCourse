const FORMAT = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }

function formatDate(iso) {
  if (!iso) {
    return null
  }
  return new Date(iso).toLocaleString('ru-RU', FORMAT)
}

export default function Task({ task, onEdit, onDelete }) {
  const priority = task.priority?.name
  const status = task.status?.name
  const category = task.category?.name
  const tags = (task.task_tags ?? [])
    .map((taskTag) => taskTag.tag?.name)
    .filter(Boolean)

  return (
    <article className={`task${task.status?.id === 3 ? ' task-completed' : ''}`}>
      <h3 className="task-name">{task.name}</h3>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        {priority && (
          <span className="task-meta-item">
            Приоритет: <b>{priority}</b>
          </span>
        )}
        {status && (
          <span className="task-meta-item">
            Статус: <b>{status}</b>
          </span>
        )}
        {category && (
          <span className="task-meta-item">
            Категория: <b>{category}</b>
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="task-tags">
          Теги: <b>{tags.join(', ')}</b>
        </div>
      )}

      <div className="task-dates">
        <span>Создана: {formatDate(task.created_at)}</span>
        {formatDate(task.updated_at) && <span>Изменена: {formatDate(task.updated_at)}</span>}
        {formatDate(task.finished_at) && <span>Выполнена: {formatDate(task.finished_at)}</span>}
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)}>
          Редактировать
        </button>
        <button type="button" onClick={() => onDelete(task)}>
          Удалить
        </button>
      </div>
    </article>
  )
}
