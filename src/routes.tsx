import { Navigate, type RouteObject } from 'react-router'
import ProtectedRoute from './components/features/ProtectedRoute'
import SignUp from './pages/SignUp/SignUp'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/sign-up',
    Component: SignUp
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  }
]
