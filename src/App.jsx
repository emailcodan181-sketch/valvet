/**
 * VALVET — App Root
 * Configuração de rotas e providers globais.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from "./hooks/useAuth.jsx";
import { PrivateRoute, AdminRoute } from './routes/RouteGuards'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatPage     from './pages/ChatPage'
import AdminPage    from './pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* URL ofuscada para o painel admin */}
          <Route
            path="/sys/control-panel"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
