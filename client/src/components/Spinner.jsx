export default function Spinner() {
  return (
    <div className='flex justify-center py-16' role='status' aria-label='Loading'>
      <div className='size-10 animate-spin rounded-full border-4 border-[#EADFD5] border-t-brand' />
    </div>
  )
}