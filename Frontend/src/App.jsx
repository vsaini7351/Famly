import { useState } from 'react'
import { Outlet } from "react-router-dom";
import Footer from './components/Common/Footer';
import Header from './components/Common/Header';


function App() {
  
  return (
   <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}




export default App