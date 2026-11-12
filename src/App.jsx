import { Navigate, Route, Routes } from 'react-router-dom'
import FollowPage from './pages/FollowPage.jsx'
import QrPage from './pages/QrPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/follow" replace />} />
      <Route path="/follow" element={<FollowPage />} />
      <Route path="/qr" element={<QrPage />} />
      <Route path="*" element={<Navigate to="/follow" replace />} />
    </Routes>
  )
}
