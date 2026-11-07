import { Settings2, CreditCard, Boxes, Users2 } from 'lucide-react'

const sections = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'pos', label: 'POS', icon: CreditCard },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'users', label: 'Users', icon: Users2 },
]

export default function SettingsSectionNav({ activeSection, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`inline-flex min-w-[10rem] items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
          >
            <Icon size={16} />
            <span>{section.label}</span>
          </button>
        )
      })}
    </div>
  )
}
