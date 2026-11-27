export const roomTypes = [
  { value: 'bachelor_flat', label: 'Bachelor flat' },
  { value: 'single_room', label: 'Single room' },
  { value: 'sublet', label: 'Sublet' },
]

export function roomTypeLabel(value) {
  return roomTypes.find((r) => r.value === value)?.label || value
}

export function taka(n) {
  return `৳ ${Number(n).toLocaleString('en-US')}`
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function errorMessage(err) {
  return err.errors?.[0]?.message || err.message || 'Something went wrong'
}