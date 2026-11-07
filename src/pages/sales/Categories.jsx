import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import CategorySearch from '../../components/admin/categories/CategorySearch'
import CategoryTable from '../../components/admin/categories/CategoryTable'
import CategoryProductsModal from '../../components/admin/categories/CategoryProductsModal'

export default function SalesCategoriesPage() {
  const { appData, setAppData } = useAuth()

  useEffect(() => {
    if (!appData.categories || !Array.isArray(appData.categories)) {
      const fromProducts = Array.from(new Set((appData.products || []).map((p) => p.category).filter(Boolean)))
      const cats = fromProducts.map((name, i) => ({ id: `cat-${i + 1}`, name }))
      setAppData((prev) => ({ ...prev, categories: cats }))
    }
  }, [])

  const [query, setQuery] = useState('')
  const [viewCategory, setViewCategory] = useState(null)

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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Sales Categories</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Categories</h2>
            <p className="mt-2 text-sm text-slate-500">Read-only view of product categories for sales users.</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            {categories.length} categories
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <CategorySearch value={query} onChange={setQuery} />
        </div>

        <CategoryTable
          categories={filtered}
          counts={counts}
          onViewProducts={(catName) => setViewCategory(catName)}
        />
      </div>

      <CategoryProductsModal open={Boolean(viewCategory)} onClose={() => setViewCategory(null)} categoryName={viewCategory} products={categoryProducts} />
    </div>
  )
}
