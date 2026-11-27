const styles = {
  pending: 'bg-amber-100 text-amber-900',
  accepted: 'bg-green-100 text-green-900',
  rejected: 'bg-red-100 text-red-900',
  cancelled: 'bg-gray-200 text-gray-800',
  draft: 'bg-gray-200 text-gray-800',
  active: 'bg-green-100 text-green-900',
  rented: 'bg-blue-100 text-blue-900',
  archived: 'bg-gray-200 text-gray-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || ''}`}>
      {status}
    </span>
  )
}