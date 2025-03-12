import NavBar from '@/components/guest-view/Navbar'
import Footer from '@/components/ui/footer'
import { Outlet } from 'react-router-dom'

function GuestLayout() {
  return (
    <div>
       <NavBar/>
        <main className=""> 
        <Outlet /> 
        <div className="pb-6">
        <Footer/>
        </div>
      </main>
      
      
    </div>
  )
}

export default GuestLayout
