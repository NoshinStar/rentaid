import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='mx-auto max-w-[600px] px-6 py-24 text-center'>
      <p className='font-heading text-7xl font-semibold text-brand'>404</p>
      <h1 className='mt-4 font-heading text-3xl font-semibold'>This page does not exist</h1>
      <p className='mt-2 text-muted'>The address may be wrong, or the page was moved.</p>
      <Link to='/' className='mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white'>
        Return to home
      </Link>
    </div>
  )
}