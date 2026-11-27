export default function ConfirmModal({ open, title, message, confirmText = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl'>
        <h2 id='modal-title' className='font-heading text-xl font-semibold'>{title}</h2>
        <p className='mt-2 text-muted'>{message}</p>
        <div className='mt-6 flex justify-end gap-3'>
          <button onClick={onCancel} className='rounded-full border border-[#D9CFC4] px-5 py-2 font-semibold'>
            Keep it
          </button>
          <button onClick={onConfirm} className='rounded-full bg-red-700 px-5 py-2 font-semibold text-white'>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}