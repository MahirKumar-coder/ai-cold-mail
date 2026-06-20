import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { useAuth } from './context/auth.context.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import Dashboard from './pages/Dashboard.jsx'

const App = () => {
  const { loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

// 3:00:07
