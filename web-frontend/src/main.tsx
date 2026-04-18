import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import AdminGate from './admin/AdminGate'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminGate />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
)
