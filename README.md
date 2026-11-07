# AgroChem ERP — Agricultural Chemicals & Inventory Management System

An all-in-one Enterprise Resource Planning (ERP) web application built for agricultural supply distributors, pesticide retailers, and fertilizer stockists. AgroChem ERP simplifies point-of-sale operations, inventory management, batch expiry tracking, and customer credit ledger management.

---

## 🌟 Key Features

### 🛒 Point of Sale (POS) & Billing
- Fast product search and category filtering (Insecticides, Herbicides, Fertilizers, Fungicides).
- Real-time stock availability and unit pricing.
- Flexible payment methods: **Cash**, **Credit**, **Split Payments**, and **Due Plans**.
- Automatic invoice numbering and thermal/A4 printable receipts.
- Direct customer assignment and on-the-spot customer registration.

### 📦 Inventory & Multi-Warehouse Tracking
- Multi-warehouse stock tracking (`Warehouse A`, `Warehouse B`).
- Low-stock visual alerts with configurable minimum thresholds.
- Batch number tracking with manufacturing and expiry date records.
- Stock reports with instant HTML export and printer-friendly views.

### ⏳ Batch & Expiry Management
- Visual status indicators: **Active**, **Expiring Soon** (< 30/45 days), and **Expired**.
- Batch lifecycle history and manufacturer details.

### 👥 Customer Ledger & CRM
- Customer purchase history and outstanding balances.
- Account statements and printable transaction slips.

### 🏢 Vendor Management & Purchase Orders
- Comprehensive vendor directory and supplied catalog.
- Purchase order generation (`Pending`, `Received`, `Cancelled`).
- Automatic inventory replenishment when PO shipments are marked delivered.

### 📊 Business Analytics & Reports
- Interactive charts powered by **Recharts**:
  - Monthly revenue vs. last month comparison.
  - Sales by category distribution.
  - Top-selling products and profit margins.
  - Stock valuation and inventory alerts.

### 🔐 Role-Based Access Control
- **System Administrator**: Full system control, global settings, user management, and sensitive reports.
- **Sales Representative**: Dedicated sales portal with POS checkout, customer accounts, and read-only inventory lookup.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, React Router DOM v7
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Visualizations:** Recharts
- **Build Tool:** Vite 8
- **Testing:** Vitest, React Testing Library, JSDOM

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/agrochem-erp.git
   cd agrochem-erp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@erp.com` | `admin@123` | Full Admin Dashboard (`/admin/*`) |
| **Salesman** | `salesman@erp.com` | `salesman@123` | Sales Portal (`/sales/*`) |

---

## 🧪 Running Tests

To run the Vitest test suite:
```bash
npx vitest run
```

To build for production:
```bash
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
