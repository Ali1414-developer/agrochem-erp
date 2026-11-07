export default function ExpiryStatusBadge({ status }) {
  const styles = {
    expired: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
    expiring: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
    safe: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  }

  const labels = {
    expired: 'Expired',
    expiring: 'Expiring soon',
    safe: 'Safe',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${styles[status] || styles.safe}`}>
      {labels[status] || labels.safe}
    </span>
  )
}
