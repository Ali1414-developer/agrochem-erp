import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadSession, saveSession, clearSession } from '../utils/session'

const AuthContext = createContext(null)

const initialUsers = [
  {
    id: 'admin-1',
    fullName: 'System Administrator',
    email: 'admin@erp.com',
    password: 'admin@123',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'salesman-1',
    fullName: 'Sales Representative',
    email: 'salesman@erp.com',
    password: 'salesman@123',
    role: 'salesman',
    status: 'active',
  },
]

export const defaultSettings = {
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

const initialAppData = {
  products: [
    {
      id: 'p1',
      name: 'CropCare 250',
      sku: 'CC250',
      category: 'Insecticide',
      description: 'Fast-acting crop protection for common insect pests.',
      qty: 34,
      unit: 'L',
      purchasePrice: 25,
      sellingPrice: 40,
      vendor: 'Pesticide Distributors',
      batchNumber: 'BX-1024',
      mfgDate: '2026-01-15',
      expiryDate: '2026-08-15',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p2',
      name: 'FieldGuard Pro',
      sku: 'FGP202',
      category: 'Herbicide',
      description: 'Precision weed control formulation for field crops.',
      qty: 12,
      unit: 'L',
      purchasePrice: 28,
      sellingPrice: 45,
      vendor: 'AgroChem Partners',
      batchNumber: 'BX-2048',
      mfgDate: '2026-02-10',
      expiryDate: '2026-09-10',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p3',
      name: 'HarvestMax',
      sku: 'HMX350',
      category: 'Fungicide',
      description: 'Broad-spectrum protectant for crop disease management.',
      qty: 8,
      unit: 'KG',
      purchasePrice: 30,
      sellingPrice: 52,
      vendor: 'AgroChem Partners',
      batchNumber: 'BX-1026',
      mfgDate: '2026-01-20',
      expiryDate: '2026-09-02',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p4',
      name: 'SafeGrow',
      sku: 'SG560',
      category: 'Fertilizer',
      description: 'Balanced nutrient blend to support healthy crop growth.',
      qty: 56,
      unit: 'KG',
      purchasePrice: 18,
      sellingPrice: 32,
      vendor: 'Pesticide Distributors',
      batchNumber: 'BX-4032',
      mfgDate: '2026-03-05',
      expiryDate: '2027-03-05',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p5',
      name: 'LeafShield',
      sku: 'LS450',
      category: 'Fungicide',
      description: 'Protects leaves from mildew and blight while preserving plant vigor.',
      qty: 42,
      unit: 'L',
      purchasePrice: 22,
      sellingPrice: 38,
      vendor: 'NatureCrop Supplies',
      batchNumber: 'BX-5056',
      mfgDate: '2026-02-01',
      expiryDate: '2026-10-01',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p6',
      name: 'RootBoost',
      sku: 'RB780',
      category: 'Fertilizer',
      description: 'High-nutrient root stimulator for stronger establishment and growth.',
      qty: 28,
      unit: 'KG',
      purchasePrice: 15,
      sellingPrice: 26,
      vendor: 'GreenScape Traders',
      batchNumber: 'BX-6068',
      mfgDate: '2026-03-12',
      expiryDate: '2027-03-12',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p7',
      name: 'AquaGuard',
      sku: 'AG330',
      category: 'Insecticide',
      description: 'Water-based insect control for foliage and stem pests.',
      qty: 18,
      unit: 'L',
      purchasePrice: 27,
      sellingPrice: 43,
      vendor: 'Pesticide Distributors',
      batchNumber: 'BX-7072',
      mfgDate: '2026-01-25',
      expiryDate: '2026-11-25',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p8',
      name: 'GrainGuard',
      sku: 'GG910',
      category: 'Herbicide',
      description: 'Durable weed control for grains and broad-acre crops.',
      qty: 65,
      unit: 'L',
      purchasePrice: 20,
      sellingPrice: 35,
      vendor: 'AgroChem Partners',
      batchNumber: 'BX-8084',
      mfgDate: '2026-03-15',
      expiryDate: '2026-12-15',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p9',
      name: 'NutriPlus',
      sku: 'NP220',
      category: 'Fertilizer',
      description: 'Complete nutrient formula for sustained crop performance.',
      qty: 50,
      unit: 'KG',
      purchasePrice: 24,
      sellingPrice: 39,
      vendor: 'NatureCrop Supplies',
      batchNumber: 'BX-9090',
      mfgDate: '2026-02-18',
      expiryDate: '2027-02-18',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p10',
      name: 'TerraMax',
      sku: 'TM140',
      category: 'Fertilizer',
      description: 'Soil conditioner that improves structure and nutrient uptake.',
      qty: 33,
      unit: 'KG',
      purchasePrice: 17,
      sellingPrice: 29,
      vendor: 'GreenScape Traders',
      batchNumber: 'BX-1012',
      mfgDate: '2026-04-07',
      expiryDate: '2027-04-07',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p11',
      name: 'PestAway',
      sku: 'PA470',
      category: 'Insecticide',
      description: 'Broad-spectrum pest control for fruit and vegetable crops.',
      qty: 22,
      unit: 'L',
      purchasePrice: 26,
      sellingPrice: 44,
      vendor: 'Pesticide Distributors',
      batchNumber: 'BX-1116',
      mfgDate: '2026-02-27',
      expiryDate: '2026-12-27',
      minStock: 10,
      status: 'active',
    },
    {
      id: 'p12',
      name: 'BloomGuard',
      sku: 'BG680',
      category: 'Fungicide',
      description: 'Flowering crop defense against fungal infection and blossom blight.',
      qty: 15,
      unit: 'L',
      purchasePrice: 31,
      sellingPrice: 53,
      vendor: 'AgroChem Partners',
      batchNumber: 'BX-1218',
      mfgDate: '2026-03-22',
      expiryDate: '2026-11-22',
      minStock: 10,
      status: 'active',
    },
  ],
  inventory: [
    {
      id: 'i1',
      productId: 'p1',
      productName: 'CropCare 250',
      qty: 150,
      warehouse: 'Warehouse A',
      batchNumber: 'BX-1024',
      expiryDate: '2026-08-15',
      location: 'Warehouse A',
    },
    {
      id: 'i2',
      productId: 'p2',
      productName: 'FieldGuard Pro',
      qty: 220,
      warehouse: 'Warehouse B',
      batchNumber: 'BX-2048',
      expiryDate: '2026-09-10',
      location: 'Warehouse B',
    },
    {
      id: 'i3',
      productId: 'p3',
      productName: 'HarvestMax',
      qty: 85,
      warehouse: 'Warehouse A',
      batchNumber: 'BX-1026',
      expiryDate: '2026-09-02',
      location: 'Warehouse A',
    },
    {
      id: 'i4',
      productId: 'p4',
      productName: 'SafeGrow',
      qty: 300,
      warehouse: 'Warehouse C',
      batchNumber: 'BX-4032',
      expiryDate: '2027-03-05',
      location: 'Warehouse C',
    },
    {
      id: 'i5',
      productId: 'p5',
      productName: 'LeafShield',
      qty: 180,
      warehouse: 'Warehouse B',
      batchNumber: 'BX-5056',
      expiryDate: '2026-10-01',
      location: 'Warehouse B',
    },
    {
      id: 'i6',
      productId: 'p6',
      productName: 'RootBoost',
      qty: 240,
      warehouse: 'Warehouse A',
      batchNumber: 'BX-6068',
      expiryDate: '2027-03-12',
      location: 'Warehouse A',
    },
    {
      id: 'i7',
      productId: 'p7',
      productName: 'AquaGuard',
      qty: 310,
      warehouse: 'Warehouse C',
      batchNumber: 'BX-7072',
      expiryDate: '2026-11-25',
      location: 'Warehouse C',
    },
    {
      id: 'i8',
      productId: 'p8',
      productName: 'GrainGuard',
      qty: 450,
      warehouse: 'Warehouse B',
      batchNumber: 'BX-8084',
      expiryDate: '2026-12-15',
      location: 'Warehouse B',
    },
    {
      id: 'i9',
      productId: 'p9',
      productName: 'NutriPlus',
      qty: 290,
      warehouse: 'Warehouse A',
      batchNumber: 'BX-9090',
      expiryDate: '2027-02-18',
      location: 'Warehouse A',
    },
    {
      id: 'i10',
      productId: 'p10',
      productName: 'TerraMax',
      qty: 165,
      warehouse: 'Warehouse C',
      batchNumber: 'BX-1012',
      expiryDate: '2027-04-07',
      location: 'Warehouse C',
    },
    {
      id: 'i11',
      productId: 'p11',
      productName: 'PestAway',
      qty: 120,
      warehouse: 'Warehouse B',
      batchNumber: 'BX-1116',
      expiryDate: '2026-12-27',
      location: 'Warehouse B',
    },
    {
      id: 'i12',
      productId: 'p12',
      productName: 'BloomGuard',
      qty: 190,
      warehouse: 'Warehouse A',
      batchNumber: 'BX-1218',
      expiryDate: '2026-11-22',
      location: 'Warehouse A',
    },
    {
      id: 'i13',
      productId: null,
      productName: 'Raw Soluble Sulphur 90%',
      sku: 'RSS900',
      category: 'Fungicide',
      unit: 'KG',
      qty: 250,
      warehouse: 'Central Bulk Depot',
      batchNumber: 'BULK-901',
      expiryDate: '2027-08-30',
      location: 'Central Bulk Depot',
      vendor: 'AgroChem Partners',
      purchasePrice: 14,
    },
    {
      id: 'i14',
      productId: null,
      productName: 'Bio-Phosphate Concentrate',
      sku: 'BPC500',
      category: 'Fertilizer',
      unit: 'KG',
      qty: 400,
      warehouse: 'Warehouse C',
      batchNumber: 'BULK-402',
      expiryDate: '2028-01-15',
      location: 'Warehouse C',
      vendor: 'GreenScape Traders',
      purchasePrice: 10,
    },
    {
      id: 'i15',
      productId: null,
      productName: 'Commercial Copper Sulfate Base',
      sku: 'CCS120',
      category: 'Fungicide',
      unit: 'L',
      qty: 180,
      warehouse: 'Warehouse A',
      batchNumber: 'BULK-110',
      expiryDate: '2027-11-10',
      location: 'Warehouse A',
      vendor: 'NatureCrop Supplies',
      purchasePrice: 19,
    },
    {
      id: 'i16',
      productId: null,
      productName: 'Industrial Potassium Nitrate Powder',
      sku: 'IPN750',
      category: 'Fertilizer',
      unit: 'KG',
      qty: 350,
      warehouse: 'Central Bulk Depot',
      batchNumber: 'BULK-770',
      expiryDate: '2027-06-20',
      location: 'Central Bulk Depot',
      vendor: 'Pesticide Distributors',
      purchasePrice: 12,
    },
    {
      id: 'i17',
      productId: null,
      productName: 'Commercial Neem Oil Extract 10000 PPM',
      sku: 'CNO10K',
      category: 'Insecticide',
      unit: 'L',
      qty: 500,
      warehouse: 'Warehouse B',
      batchNumber: 'BULK-880',
      expiryDate: '2028-03-30',
      location: 'Warehouse B',
      vendor: 'NatureCrop Supplies',
      purchasePrice: 22,
    },
    {
      id: 'i18',
      productId: null,
      productName: 'Bulk Zinc Sulfate Heptahydrate',
      sku: 'ZSH330',
      category: 'Fertilizer',
      unit: 'KG',
      qty: 280,
      warehouse: 'Warehouse C',
      batchNumber: 'BULK-330',
      expiryDate: '2027-10-15',
      location: 'Warehouse C',
      vendor: 'GreenScape Traders',
      purchasePrice: 16,
    },
  ],
  customers: [
    { id: 'c1', name: 'AgriFarm Supply' },
    { id: 'c2', name: 'GreenGrow Ltd.' },
    { id: 'c3', name: 'NatureField Traders' },
  ],
  vendors: [
    {
      id: 'v1',
      name: 'Pesticide Distributors',
      company: 'PestPro Agro Supply',
      phone: '0300-1234567',
      email: 'contact@pesticidedistributors.com',
      address: '18 Market Road, Lahore',
      notes: 'Primary supplier for insecticides and crop protection products.',
      suppliedProducts: [],
      purchaseHistory: [],
    },
    {
      id: 'v2',
      name: 'AgroChem Partners',
      company: 'AgroChem Industries',
      phone: '0312-9876543',
      email: 'sales@agrochempartners.com',
      address: '42 Canal View, Faisalabad',
      notes: 'Handles herbicide and fertilizer replenishment.',
      suppliedProducts: [],
      purchaseHistory: [],
    },
    {
      id: 'v3',
      name: 'NatureCrop Supplies',
      company: 'NatureCrop Agri Hub',
      phone: '0321-4567890',
      email: 'orders@naturecropsupplies.com',
      address: '7 Orchard Lane, Multan',
      notes: 'Supplies specialty nutrition and soil treatment inputs.',
      suppliedProducts: [],
      purchaseHistory: [],
    },
    {
      id: 'v4',
      name: 'GreenScape Traders',
      company: 'GreenScape Agri Commerce',
      phone: '0345-3210987',
      email: 'support@greenscapetraders.com',
      address: '91 Green Valley Street, Rawalpindi',
      notes: 'Seasonal supplier for nursery and orchard products.',
      suppliedProducts: [],
      purchaseHistory: [],
    },
  ],
  pendingPurchaseOrders: [],
  sales: [
    {
      id: 't1',
      description: 'Sale to GreenGrow Ltd.',
      amount: 12450,
      total: 12450,
      date: '2026-07-25',
      customerName: 'GreenGrow Ltd.',
      products: [
        { productId: 'p1', name: 'CropCare 250', category: 'Insecticide', quantity: 5, unitPrice: 2490, totalPrice: 12450 },
      ],
    },
    {
      id: 't2',
      description: 'Purchase from AgroChem Partners',
      amount: 9820,
      total: 9820,
      date: '2026-07-24',
      customerName: 'AgroChem Partners',
      products: [
        { productId: 'p2', name: 'FieldGuard Pro', category: 'Herbicide', quantity: 6, unitPrice: 1637, totalPrice: 9820 },
      ],
    },
    {
      id: 't3',
      description: 'Sale to AgriFarm Supply',
      amount: 14600,
      total: 14600,
      date: '2026-07-23',
      customerName: 'AgriFarm Supply',
      products: [
        { productId: 'p3', name: 'HarvestMax', category: 'Fungicide', quantity: 8, unitPrice: 1825, totalPrice: 14600 },
      ],
    },
    {
      id: 't4',
      description: 'Sale to NatureField Traders',
      amount: 11800,
      total: 11800,
      date: '2026-07-22',
      customerName: 'NatureField Traders',
      products: [
        { productId: 'p5', name: 'LeafShield', category: 'Fungicide', quantity: 7, unitPrice: 1685.71, totalPrice: 11800 },
      ],
    },
    {
      id: 't5',
      description: 'Purchase from Pesticide Distributors',
      amount: 7250,
      total: 7250,
      date: '2026-07-21',
      customerName: 'Pesticide Distributors',
      products: [
        { productId: 'p7', name: 'AquaGuard', category: 'Insecticide', quantity: 5, unitPrice: 1450, totalPrice: 7250 },
      ],
    },
    {
      id: 't6',
      description: 'Sale to CropMart Ventures',
      amount: 9800,
      total: 9800,
      date: '2026-07-20',
      customerName: 'CropMart Ventures',
      products: [
        { productId: 'p8', name: 'GrainGuard', category: 'Herbicide', quantity: 7, unitPrice: 1400, totalPrice: 9800 },
      ],
    },
  ],
  batches: [
    { id: 'b1', batchNumber: 'BX-1024', productName: 'CropCare 250', expiryDate: '2026-08-15' },
    { id: 'b2', batchNumber: 'BX-1026', productName: 'HarvestMax', expiryDate: '2026-09-02' },
  ],
  settings: defaultSettings,
}

// derive initial categories from products and ensure 'Uncategorized' exists
{
  const derived = Array.from(new Set(initialAppData.products.map((p) => p.category).filter(Boolean)))
  const cats = derived.map((name, i) => ({ id: `cat-${i + 1}`, name }))
  const hasUnc = cats.some((c) => c.name === 'Uncategorized')
  if (!hasUnc) cats.push({ id: `cat-unc`, name: 'Uncategorized' })
  initialAppData.categories = cats
}

export function syncProductsAndInventory(data) {
  if (!data || typeof data !== 'object') return data
  const rawProducts = Array.isArray(data.products) ? data.products : []
  const rawInventory = Array.isArray(data.inventory) ? data.inventory : []

  const syncedProducts = []
  const syncedInventory = []
  const processedProductIds = new Set()
  const processedInventoryIds = new Set()

  rawProducts.forEach((prod) => {
    processedProductIds.add(prod.id)
    const inv = rawInventory.find(
      (i) => i.productId === prod.id || (i.productName && i.productName.toLowerCase() === prod.name?.toLowerCase()),
    )

    if (inv) {
      processedInventoryIds.add(inv.id)
      const syncedBatch = inv.batchNumber || prod.batchNumber || ''
      const syncedExpiry = inv.expiryDate ?? prod.expiryDate ?? null
      const syncedVendor = inv.vendor || prod.vendor || ''
      const syncedCategory = prod.category || inv.category || 'Uncategorized'
      const syncedSku = prod.sku || inv.sku || ''
      const syncedUnit = prod.unit || inv.unit || 'L'

      syncedProducts.push({
        ...prod,
        batchNumber: syncedBatch,
        expiryDate: syncedExpiry,
        vendor: syncedVendor,
        category: syncedCategory,
        sku: syncedSku,
        unit: syncedUnit,
      })

      syncedInventory.push({
        ...inv,
        productId: prod.id,
        productName: prod.name,
        batchNumber: syncedBatch,
        expiryDate: syncedExpiry,
        vendor: syncedVendor,
        category: syncedCategory,
        sku: syncedSku,
        unit: syncedUnit,
        warehouse: inv.warehouse || 'Warehouse A',
        location: inv.location || inv.warehouse || 'Warehouse A',
      })
    } else {
      syncedProducts.push({ ...prod })
      syncedInventory.push({
        id: `inv_${prod.id}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku || '',
        category: prod.category || 'Uncategorized',
        unit: prod.unit || 'L',
        qty: Number(prod.qty || 0),
        warehouse: 'Warehouse A',
        location: 'Warehouse A',
        batchNumber: prod.batchNumber || '',
        expiryDate: prod.expiryDate || null,
        vendor: prod.vendor || '',
      })
    }
  })

  rawInventory.forEach((inv) => {
    if (processedInventoryIds.has(inv.id)) return
    syncedInventory.push(inv)
  })

  return {
    ...data,
    products: syncedProducts,
    inventory: syncedInventory,
  }
}

const storageKey = 'erp-auth'
const storageKeyAppData = 'erp-data'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [authStorageMode, setAuthStorageMode] = useState('local')
  const [users, setUsers] = useState(() => {
    const saved = loadSession('erp-users')
    if (!saved || !Array.isArray(saved)) {
      return initialUsers
    }

    const merged = initialUsers.map((defaultUser) => {
      const existing = saved.find(
        (user) => user.email?.toLowerCase() === defaultUser.email.toLowerCase(),
      )
      return existing || defaultUser
    })

    const extra = saved.filter(
      (user) => !initialUsers.some((defaultUser) => user.email?.toLowerCase() === defaultUser.email.toLowerCase()),
    )

    return [...merged, ...extra]
  })

  const [passwordResetRequests, setPasswordResetRequests] = useState({})

  const [appData, setAppDataState] = useState(() => {
    const saved = loadSession(storageKeyAppData)
    if (saved && typeof saved === 'object' && Array.isArray(saved.products) && Array.isArray(saved.inventory)) {
      return syncProductsAndInventory(saved)
    }
    return syncProductsAndInventory(initialAppData)
  })

  const setAppData = (action) => {
    setAppDataState((prev) => {
      const nextData = typeof action === 'function' ? action(prev) : action
      return syncProductsAndInventory(nextData)
    })
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKeyAppData && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed && typeof parsed === 'object' && Array.isArray(parsed.products)) {
            setAppDataState(syncProductsAndInventory(parsed))
          }
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const session = loadSession(storageKey)
    if (session && session.user && session.token) {
      const found = users.find((user) => user.email === session.user.email)
      if (found && found.status === 'active') {
        setCurrentUser(found)
        setIsAuthenticated(true)
        setAuthStorageMode(session.storage || 'local')
      } else {
        clearSession(storageKey)
      }
    }
    setIsAuthLoading(false)
  }, [users])

  useEffect(() => {
    saveSession('erp-users', users)
  }, [users])

  useEffect(() => {
    saveSession(storageKeyAppData, appData)
  }, [appData])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      saveSession(storageKey, { token: 'erp-token', user: currentUser, storage: authStorageMode }, authStorageMode)
    } else if (!isAuthenticated) {
      clearSession(storageKey)
    }
  }, [authStorageMode, currentUser, isAuthenticated])

  const login = async ({ email, password, remember }) => {
    setAuthError(null)
    setIsAuthLoading(true)

    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedPassword = password?.trim()

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (!normalizedEmail) {
      setAuthError('Please enter your email address.')
      setIsAuthLoading(false)
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setAuthError('Please enter a valid email address.')
      setIsAuthLoading(false)
      return false
    }

    if (!normalizedPassword) {
      setAuthError('Please enter your password.')
      setIsAuthLoading(false)
      return false
    }

    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user) {
      setAuthError('Invalid email or password.')
      setIsAuthLoading(false)
      return false
    }

    if (user.password !== password) {
      setAuthError('Invalid email or password.')
      setIsAuthLoading(false)
      return false
    }

    if (user.status !== 'active') {
      setAuthError('Your account is currently inactive. Please contact the administrator.')
      setIsAuthLoading(false)
      return false
    }

    setAuthStorageMode(remember ? 'local' : 'session')
    setCurrentUser(user)
    setIsAuthenticated(true)
    setIsAuthLoading(false)

    return user
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setAuthError(null)
    clearSession(storageKey)
  }

  const requestPasswordReset = ({ email }) => {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, message: 'Please enter a valid email address.' }
    }

    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user) {
      return { success: false, message: 'No account found with this email address.' }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000

    setPasswordResetRequests((prev) => ({
      ...prev,
      [normalizedEmail]: { code, expiresAt },
    }))

    return {
      success: true,
      message: 'Verification code generated. Please use the code sent to your email to reset your password.',
      code,
    }
  }

  const resetPassword = ({ email, code, newPassword }) => {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, message: 'Please enter a valid email address.' }
    }

    if (!code) {
      return { success: false, message: 'Please enter the verification code.' }
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' }
    }

    const request = passwordResetRequests[normalizedEmail]
    if (!request) {
      return { success: false, message: 'No password reset request found for this email address.' }
    }

    if (Date.now() > request.expiresAt) {
      setPasswordResetRequests((prev) => {
        const next = { ...prev }
        delete next[normalizedEmail]
        return next
      })
      return { success: false, message: 'The verification code has expired. Please request a new one.' }
    }

    if (request.code !== code.trim()) {
      return { success: false, message: 'The verification code is incorrect.' }
    }

    setUsers((prev) =>
      prev.map((item) =>
        item.email.toLowerCase() === normalizedEmail ? { ...item, password: newPassword } : item,
      ),
    )

    if (currentUser?.email.toLowerCase() === normalizedEmail) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : prev))
    }

    setPasswordResetRequests((prev) => {
      const next = { ...prev }
      delete next[normalizedEmail]
      return next
    })

    return { success: true, message: 'Your password has been reset successfully.' }
  }

  const addSalesman = (salesman) => {
    setUsers((prev) => [...prev, { ...salesman, id: `salesman-${Date.now()}`, role: 'salesman', status: 'active' }])
  }

  const updateUser = (id, updates) => {
    setUsers((prev) => {
      const nextUsers = prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
      const updatedUser = nextUsers.find((user) => user.id === id)
      if (updatedUser && currentUser?.id === id) {
        setCurrentUser(updatedUser)
      }
      return nextUsers
    })
  }

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      isAuthLoading,
      authError,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
      addSalesman,
      updateUser,
      removeUser,
      hasRole: (role) => currentUser?.role === role,
      isAdmin: () => currentUser?.role === 'admin',
      isSalesman: () => currentUser?.role === 'salesman',
      users,
      appData,
      setAppData,
    }),
    [currentUser, isAuthenticated, isAuthLoading, authError, users, passwordResetRequests, appData],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
