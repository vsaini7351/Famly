
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Route,createBrowserRouter,createRoutesFromElements,RouterProvider} from 'react-router-dom'
import { AuthProvider } from './utils/authContext.jsx'
import AuthCard from './components/Login/Login.jsx'
import AuthPage from './pages/auth/Login.jsx'
import DashboardLayout from './pages/Dashboard/Dashboard.jsx'


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<DashboardLayout/>} errorElement>

    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
    
  
)
