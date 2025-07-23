import { useAuthStore } from '@/stores/authStore'
import { Navigate } from 'react-router'

import { type ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore()

  if (!user) return <Navigate to='/login' />

  return children
}

export default ProtectedRoute
