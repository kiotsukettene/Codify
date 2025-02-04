import PasswordResetSuccess from '@/components/Auth/Password-success-reset'
import { Button } from '@/components/ui/button'
import React from 'react'

function AdminSuccessResetPage() {
  return (
    <div>
      <PasswordResetSuccess navigateTo='/admin-login'/>
      
    </div>
  )
}

export default AdminSuccessResetPage
