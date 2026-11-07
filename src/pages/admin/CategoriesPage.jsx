import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import CategorySearch from '../../components/admin/categories/CategorySearch'
import CategoryTable from '../../components/admin/categories/CategoryTable'
import CategoryForm from '../../components/admin/categories/CategoryForm'
import DeleteCategoryModal from '../../components/admin/categories/DeleteCategoryModal'
import CategoryProductsModal from '../../components/admin/categories/CategoryProductsModal'

export default function CategoriesPage() {
  const { appData, setAppData } = useAuth()

  // ensure categories array exists in appData
  useEffect(() => {
    if (!appData.categories || !Array.isArray(appData.categories)) {
      const fromProducts = Array.from(new Set((appData.products || []).map((p) => p.category).filter(Boolean)))
      const cats = fromProducts.map((name, i) => ({ id: `cat-${i + 1}`, name }))
      setAppData((prev) => ({ ...prev, categories: cats }))
    }
  }, [])

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [viewCategory, setViewCategory] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Dynamically merge stored categories with any category names present in products or inventory
  const categories = useMemo(() => {
    const stored = appData.categories || []
    const existingNames = new Set(stored.map((c) => (c.name || '').trim().toLowerCase()))

    const extras = []
    ;(appData.products || []).forEach((p) => {
      const cat = (p.category || '').trim()
      if (cat && !existingNames.has(cat.toLowerCase())) {
        existingNames.add(cat.toLowerCase())
        extras.push({ id: `cat_auto_${cat.toLowerCase().replace(/\s+/g, '_')}`, name: cat })
      }
    })
    ;(appData.inventory || []).forEach((inv) => {
      const cat = (inv.category || '').trim()
      if (cat && !existingNames.has(cat.toLowerCase())) {
        existingNames.add(cat.toLowerCase())
        extras.push({ id: `cat_auto_${cat.toLowerCase().replace(/\s+/g, '_')}`, name: cat })
      }
    })

    return [...stored, ...extras]
  }, [appData.categories, appData.products, appData.inventory])

  const counts = useMemo(() => {
    const map = {}
    const prodList = appData.products || []

    categories.forEach((cat) => {
      const catNameLower = (cat.name || '').trim().toLowerCase()
      const matchingCount = prodList.filter((p) => {
        const pCat = (p.category || 'Uncategorized').trim().toLowerCase()
        return pCat === catNameLower
      }).length

      map[cat.name] = matchingCount
    })

    return map
  }, [categories, appData.products])

  const categoryProducts = useMemo(() => {
    if (!viewCategory) return []
    const viewCatLower = viewCategory.trim().toLowerCase()
    return (appData.products || []).filter((p) => {
      const cat = (p.category || 'Uncategorized').trim().toLowerCase()
      return cat === viewCatLower
    })
  }, [appData.products, viewCategory])

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, query])

  const openAdd = () => { setSelected(null); setFormOpen(true) }
  const openEdit = (cat) => { setSelected(cat); setFormOpen(true) }
  const openDelete = (cat) => { setSelected(cat); setDeleteOpen(true) }

  const saveCategory = (cat) => {
    if (!cat.id) return
    const exists = (appData.categories || []).some((c) => c.id === cat.id)
    if (!exists) {
      setAppData((prev) => ({ ...prev, categories: [...(prev.categories || []), cat] }))
      return
    }
    // update name and update products assigned to this category
    const prevCats = appData.categories || []
    const old = prevCats.find((c) => c.id === cat.id)
    setAppData((prev) => ({
      ...prev,
      categories: (prev.categories || []).map((c) => (c.id === cat.id ? { ...c, name: cat.name } : c)),
      products: (prev.products || []).map((p) => (p.category === old?.name ? { ...p, category: cat.name } : p)),
    }))
  }

  const confirmDelete = (id) => {
    const cat = (appData.categories || []).find((c) => c.id === id)
    if (!cat) return
    // ensure 'Uncategorized' exists
    let unc = (appData.categories || []).find((c) => c.name === 'Uncategorized')
    if (!unc) {
      unc = { id: `cat-unc-${Date.now()}`, name: 'Uncategorized' }
    }
    setAppData((prev) => ({
      ...prev,
      categories: (prev.categories || []).filter((c) => c.id !== id).concat(unc && !(prev.categories || []).some(c=>c.id===unc.id) ? [unc] : []),
      products: (prev.products || []).map((p) => (p.category === cat.name ? { ...p, category: 'Uncategorized' } : p)),
    }))
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Categories</h2>
            <p className="mt-2 text-sm text-slate-500">Manage product categories used across the ERP.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="inline-flex w-full items-center justify-center rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:w-auto">
              {categories.length} categories
            </span>
            <button onClick={openAdd} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto">Add category</button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <CategorySearch value={query} onChange={setQuery} />
        </div>

        <CategoryTable
          categories={filtered}
          counts={counts}
          onEdit={openEdit}
          onDelete={openDelete}
          onViewProducts={(catName) => setViewCategory(catName)}
        />
      </div>

      <CategoryForm open={formOpen} onClose={() => setFormOpen(false)} onSave={saveCategory} category={selected} />
      <DeleteCategoryModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} category={selected} />
      <CategoryProductsModal open={Boolean(viewCategory)} onClose={() => setViewCategory(null)} categoryName={viewCategory} products={categoryProducts} />
    </div>
  )
}

