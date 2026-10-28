import React from 'react'
import AuthLayout from '@/modules/auth/components/AuthLayout'
import SignUpForm from '@/modules/auth/components/SignUpForm'

const SignUp = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}

export default SignUp
