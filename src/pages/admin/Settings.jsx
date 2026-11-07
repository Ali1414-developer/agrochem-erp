import { useEffect, useMemo, useState } from 'react'
import { Save, RotateCcw, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SettingsSectionNav from '../../components/admin/settings/SettingsSectionNav'
import SettingsCard from '../../components/admin/settings/SettingsCard'
import { loadSession, saveSession } from '../../utils/session'

const storageKey = 'erp-settings'

const defaultSettings = {
  general: {
    erpName: 'AgroChem ERP',
    businessName: 'AgroChem Pesticides',
    contactEmail: 'support@agrochem.com',
    contactPhone: '+1 555 0123',
    address: 'North Industrial Road, Nairobi',
  },
  appearance: {
    primaryColor: '#059669',
    secondaryColor: '#0f172a',
    sidebarCollapsed: false,
  },
  pos: {
    defaultPaymentMethod: 'Cash',
    printReceipt: true,
    autoInvoiceNumber: true,
    invoicePrefix: 'INV',
  },
  inventory: {
    lowStockThreshold: 10,
    expiryWarningDays: 30,
  },
  users: {
    salesmanCanEditInventory: false,
    salesmanCanViewReports: false,
    salesmanCanAccessPOS: true,
  },
  system: {
    autoSave: true,
    sessionTimeoutMinutes: 60,
    keepAuditTrail: true,
  },
}

function readSettings() {
  const saved = loadSession(storageKey)
  if (!saved || typeof saved !== 'object') return defaultSettings

  return {
    general: { ...defaultSettings.general, ...(saved.general || {}) },
    appearance: { ...defaultSettings.appearance, ...(saved.appearance || {}) },
    pos: { ...defaultSettings.pos, ...(saved.pos || {}) },
    inventory: { ...defaultSettings.inventory, ...(saved.inventory || {}) },
    users: { ...defaultSettings.users, ...(saved.users || {}) },
    system: { ...defaultSettings.system, ...(saved.system || {}) },
  }
}

export default function SettingsPage() {
  const { appData, setAppData } = useAuth()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(() => appData?.settings || readSettings())
  const [saved, setSaved] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const nextSettings = appData?.settings || readSettings()
    if (saved) {
      setSettings(nextSettings)
    }
  }, [appData?.settings, saved])

  const updateSetting = (section, key, value) => {
    setSaved(false)
    setSaveSuccess(false)
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    saveSession(storageKey, settings)
    setAppData((prev) => ({ ...prev, settings }))
    setSaved(true)
    setSaveSuccess(true)
    window.setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleReset = () => {
    const reset = defaultSettings
    setSettings(reset)
    saveSession(storageKey, reset)
    setAppData((prev) => ({ ...prev, settings: reset }))
    setSaved(true)
  }

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'pos':
        return (
          <div className="space-y-4">
            <SettingsCard title="Checkout defaults" description="Set the default behavior for point-of-sale transactions.">
              <label className="space-y-2 text-sm text-slate-600">
                <span>Default payment method</span>
                <select value={settings.pos.defaultPaymentMethod} onChange={(event) => updateSetting('pos', 'defaultPaymentMethod', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>Print receipt automatically</span>
                <input type="checkbox" checked={settings.pos.printReceipt} onChange={(event) => updateSetting('pos', 'printReceipt', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>Auto-generate invoice numbers</span>
                <input type="checkbox" checked={settings.pos.autoInvoiceNumber} onChange={(event) => updateSetting('pos', 'autoInvoiceNumber', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Invoice prefix</span>
                <input value={settings.pos.invoicePrefix} onChange={(event) => updateSetting('pos', 'invoicePrefix', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
            </SettingsCard>
          </div>
        )
      case 'inventory':
        return (
          <div className="space-y-4">
            <SettingsCard title="Inventory thresholds" description="Set the alert levels that trigger operations warnings.">
              <label className="space-y-2 text-sm text-slate-600">
                <span>Low stock threshold</span>
                <input type="number" min="1" value={settings.inventory.lowStockThreshold} onChange={(event) => updateSetting('inventory', 'lowStockThreshold', Number(event.target.value))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Expiry warning period (days)</span>
                <input type="number" min="1" value={settings.inventory.expiryWarningDays} onChange={(event) => updateSetting('inventory', 'expiryWarningDays', Number(event.target.value))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
            </SettingsCard>
          </div>
        )
      case 'users':
        return (
          <div className="space-y-4">
            <SettingsCard title="Salesman permissions" description="Control which capabilities salesmen can use in the ERP.">
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>Manage inventory edits</span>
                <input type="checkbox" checked={settings.users.salesmanCanEditInventory} onChange={(event) => updateSetting('users', 'salesmanCanEditInventory', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>View reports</span>
                <input type="checkbox" checked={settings.users.salesmanCanViewReports} onChange={(event) => updateSetting('users', 'salesmanCanViewReports', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>Access POS</span>
                <input type="checkbox" checked={settings.users.salesmanCanAccessPOS} onChange={(event) => updateSetting('users', 'salesmanCanAccessPOS', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
            </SettingsCard>
          </div>
        )
      case 'general':
      default:
        return (
          <div className="space-y-4">
            <SettingsCard title="ERP identity" description="Set the core business identity used across the admin experience.">
              <label className="space-y-2 text-sm text-slate-600">
                <span>ERP name</span>
                <input value={settings.general.erpName} onChange={(event) => updateSetting('general', 'erpName', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Business name</span>
                <input value={settings.general.businessName} onChange={(event) => updateSetting('general', 'businessName', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
            </SettingsCard>
            <SettingsCard title="Contact details" description="Update business contact details shown in the system.">
              <label className="space-y-2 text-sm text-slate-600">
                <span>Contact email</span>
                <input type="email" value={settings.general.contactEmail} onChange={(event) => updateSetting('general', 'contactEmail', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Contact phone</span>
                <input value={settings.general.contactPhone} onChange={(event) => updateSetting('general', 'contactPhone', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span>Address</span>
                <input value={settings.general.address} onChange={(event) => updateSetting('general', 'address', event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
            </SettingsCard>
          </div>
        )
    }
  }, [activeSection, settings, updateSetting])

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Admin settings</h2>
            <p className="mt-2 text-sm text-slate-500">Configure the core ERP preferences that control the admin experience.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <RotateCcw size={16} /> Reset
            </button>
            <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              <Save size={16} /> Save changes
            </button>
          </div>
        </div>
        {saveSuccess && (
          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Settings saved successfully.
          </div>
        )}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <SettingsSectionNav activeSection={activeSection} onSelect={setActiveSection} />
        <div className="mt-6 space-y-4">{sectionContent}</div>
      </div>

      {!saved ? (
        <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <AlertTriangle size={18} className="mt-0.5" />
          <span>You have unsaved changes. Save them to apply them across the system.</span>
        </div>
      ) : null}
    </div>
  )
}
