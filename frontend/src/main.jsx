import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/auth-context/SocketProvider'
import AuthProvider from './context/auth-context'

createRoot(document.getElementById('root')).render(

   <BrowserRouter>
   <AuthProvider>
      <SocketProvider>
         <App />
      </SocketProvider>
   </AuthProvider>
   </BrowserRouter>

)
