import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from "./routes/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import CompleteProfile from "./pages/CompleteProfile"
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/listings" element={<Listings />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
    </Routes>
  )
}