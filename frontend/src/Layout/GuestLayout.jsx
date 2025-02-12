import NavBar from '@/components/guest-view/Navbar'
import { Outlet } from 'react-router-dom'

function GuestLayout() {
  return (
    <div>
       <NavBar/>
        <main className=""> 
        <Outlet /> 
      </main>
      
    </div>
  )
}

export default GuestLayout
