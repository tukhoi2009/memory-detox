import React from 'react'
import AuthLayout from '@/modules/auth/components/AuthLayout'
import VerifyEmailForm from '@/modules/auth/components/VerifyEmailForm'

const VerifyScreen = () => {
  return (
    <AuthLayout>
      <VerifyEmailForm />
    </AuthLayout>
  )
}

export default VerifyScreen
