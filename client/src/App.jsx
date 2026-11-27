import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetails from './pages/ListingDetails'
import ListingForm from './pages/ListingForm'
import MyListings from './pages/MyListings'
import MyBookings from './pages/MyBookings'
import Requests from './pages/Requests'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteProfile from './pages/CompleteProfile'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/listings' element={<Listings />} />
        <Route path='/listings/:id' element={<ListingDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['landlord']} />}>
          <Route path='/my-listings' element={<MyListings />} />
          <Route path='/listings/new' element={<ListingForm />} />
          <Route path='/listings/:id/edit' element={<ListingForm />} />
          <Route path='/requests' element={<Requests />} />
        </Route>

        <Route element={<ProtectedRoute roles={['tenant']} />}>
          <Route path='/my-bookings' element={<MyBookings />} />
        </Route>
      </Route>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/complete-profile' element={<CompleteProfile />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}