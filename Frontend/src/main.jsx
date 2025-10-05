import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Route,createBrowserRouter,createRoutesFromElements,RouterProvider} from 'react-router-dom'
import { AuthProvider } from './utils/authContext.jsx'
import Home from './pages/Home/HomePage.jsx'
import AuthPage from './pages/auth/Login.jsx'
import DashboardLayout from './pages/Dashboard/Dashboard.jsx'
import Overview from './components/DashboardComponents/Overview.jsx'

import { ThemeProvider } from './utils/ThemeContext.jsx'


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement>
      <Route index element={<Home/>} />
      <Route path='auth' element={<AuthPage/>} />
      <Route path='dashboard' element={<DashboardLayout/>} />
      <Route path='overview' element={<Overview/>} />


    </Route>

  )
)


createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      <ThemeProvider>
      <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
    
  
)