import { useState } from 'react'
import TaskList from './components/TaskList.jsx'
import TaskForm from './components/TaskForm.jsx'
import CategoryManager from './components/CategoryManager.jsx'
import TagManager from './components/TagManager.jsx'
import './App.css'

export default function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [listKey, setListKey] = useState(0)
  const [showCategories, setShowCategories] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [dictVersion, setDictVersion] = useState(0)

  function closeForm() {
    setShowForm(false)
    setShowCategories(false)
    setShowTags(false)
    setEditingTask(null)
  }

  function handleSaved() {
    closeForm()
    setListKey(listKey + 1)
  }

  function handleAddClick() {
    setEditingTask(null)
    setShowForm(true)
  }

  function handleEdit(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  return (
    <main className="page">
      <h1>Задачи</h1>

      <button className="addTaskButton" type="button" onClick={handleAddClick}>
        Добавить задачу
      </button>

      {(showForm || showCategories || showTags) && (
        <div className="side-panel-backdrop" onClick={closeForm} />
      )}

      <aside
        className={`side-panel${showForm || showCategories || showTags ? ' open' : ''}`}
      >
        {showForm && (
          <TaskForm
            editingTask={editingTask}
            dictVersion={dictVersion}
            onCancel={closeForm}
            onSaved={handleSaved}
            onManageCategories={() => setShowCategories(true)}
            onManageTags={() => setShowTags(true)}
          />
        )}

        {showCategories && (
          <CategoryManager
            onClose={() => setShowCategories(false)}
            onChanged={() => setDictVersion(dictVersion + 1)}
          />
        )}

        {showTags && (
          <TagManager
            onClose={() => setShowTags(false)}
            onChanged={() => setDictVersion(dictVersion + 1)}
          />
        )}
      </aside>

      <TaskList key={listKey} onEdit={handleEdit} />
    </main>
  )
}
