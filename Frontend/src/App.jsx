import { useState } from 'react'
import { Outlet } from "react-router-dom";
import Footer from './components/Common/Footer';
import Header from './components/Common/Header';


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Make sure main expands to fill space */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}




export default App