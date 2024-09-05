import React from 'react'
import OtpValidationPage from '../../otp/OtpPage'
import { useNavigate } from 'react-router-dom'

function ForgotOtpPage() {

  
    

  return (
    <OtpValidationPage forgotPassword={true}/>
  )
}

export default ForgotOtpPage