'use client'
import { submitPayment } from '@/actions/payment'
import React from 'react'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

export default function PaymentCard() {
  return (
    <div className='p-4 w-full mx-auto h-full'>
      <PaymentForm
        applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID as string}
        locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string}
        cardTokenizeResponseReceived={async (token) => {
          const result = await submitPayment(token.token)
          console.log(result)
        }}
      >
        <CreditCard />
      </PaymentForm>
    </div>
  )
}
