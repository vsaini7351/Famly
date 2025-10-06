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
<<<<<<< HEAD
import NotificationsPage from './pages/notifications/NotificationPage.jsx'
import MemberFamilyPage from './pages/family/MemberFamilyPage.jsx'
import OwnerFamilyPage from './pages/family/OwnerFamilyPage.jsx'
import CreateFamilyForm from './components/family/FamilyForm.jsx'
import JoinFamilyCard from './components/family/JoinFamilythroughInvitationCode.jsx'
=======
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'


>>>>>>> upstream/main
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement>
      <Route index element={<Home/>} />
      <Route path='auth' element={<AuthPage/>} />
      <Route path='dashboard' element={<DashboardLayout/>} />
      <Route path='overview' element={<Overview/>} />
<<<<<<< HEAD
        <Route path="notifications" element={<NotificationsPage />} />
      <Route path="owner-family/:familyId" element={<OwnerFamilyPage/>} />
      <Route path="member-family/:familyId" element={<MemberFamilyPage/>} />
      <Route path="create-family" element={<CreateFamilyForm/>} />
      <Route path="Join-family-thorught-code" element={<JoinFamilyCard/>} />
        

=======
      <Route path='about' element={<About/>} />
      <Route path='contact' element={<Contact/>} />
>>>>>>> upstream/main
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