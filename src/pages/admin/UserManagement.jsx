import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import UserTable from '../../components/admin/users/UserTable'
import UserSearch from '../../components/admin/users/UserSearch'
import AddManagerModal from '../../components/admin/users/AddManagerModal'
import EditManagerModal from '../../components/admin/users/EditManagerModal'
import ManagerDetailsModal from '../../components/admin/users/ManagerDetailsModal'
import DeleteManagerModal from '../../components/admin/users/DeleteManagerModal'

export default function UserManagement() {
  const { users, addSalesman, updateUser, removeUser } = useAuth()

  const salesmen = useMemo(() => users.filter((u) => u.role === 'salesman'), [users])

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return salesmen
    return salesmen.filter((m) => (m.fullName || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q))
  }, [salesmen, query])

  const handleCreate = (payload) => {
    const now = new Date().toISOString()
    addSalesman({ ...payload, createdAt: now })
    alert('Salesman created')
  }

  const handleEdit = (payload) => {
    const updates = { ...payload }
    if (!updates.password) delete updates.password
    updateUser(payload.id, updates)
    alert('Salesman updated')
  }

  const handleToggle = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    updateUser(user.id, { status: newStatus })
    alert(`Salesman ${newStatus}`)
  }

  const handleDelete = (id) => {
    removeUser(id)
    setDeleteOpen(false)
    alert('Salesman deleted')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
            <p className="mt-2 text-sm text-slate-500">Manage salesman accounts and credentials.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{salesmen.length} salesmen</span>
            <button onClick={() => setAddOpen(true)} className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Add Salesman</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-auto">
            <UserSearch value={query} onChange={setQuery} />
          </div>
        </div>

        <UserTable users={filtered} onView={(u)=>{setSelected(u); setViewOpen(true)}} onEdit={(u)=>{setSelected(u); setEditOpen(true)}} onDelete={(u)=>{setSelected(u); setDeleteOpen(true)}} onToggle={handleToggle} />
      </div>

      <ManagerDetailsModal open={viewOpen} onClose={()=>setViewOpen(false)} user={selected} />
      <AddManagerModal open={addOpen} onClose={()=>setAddOpen(false)} onSave={handleCreate} />
      <EditManagerModal open={editOpen} onClose={()=>setEditOpen(false)} user={selected} onSave={handleEdit} />
      <DeleteManagerModal open={deleteOpen} onClose={()=>setDeleteOpen(false)} user={selected} onConfirm={handleDelete} />
    </div>
  )
}
