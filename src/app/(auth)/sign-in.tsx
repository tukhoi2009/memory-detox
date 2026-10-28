import React, { useState } from 'react'
import AuthLayout from '@/modules/auth/components/AuthLayout'
import SignInForm from '@/modules/auth/components/SignInForm'

const SignIn = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  )
}

export default SignIn
