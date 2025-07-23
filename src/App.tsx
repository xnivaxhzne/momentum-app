import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import { routes } from './routes'

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
