'use client'

import React, { useEffect, useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/ui/CustomForm'
import useBookingStore, { Booking } from '@/zustand/bookingStore'
import { DrivingExperience, ReferredFrom } from '@/lib/enums'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import useLessonStore from '@/zustand/lessonStore'
import bookLesson from '@/actions/bookLesson'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'
import { submitPayment } from '@/actions/payment'
import { CreatePaymentResponse } from 'square'

export default function CompleteDetails() {
  const {
    setBooking,
    booking,
    step,
    setStep,
    reset: resetBooking,
  } = useBookingStore((state) => state)
  const { lessons } = useLessonStore((state) => state)
  const selectedLesson = lessons?.find((item) => item.id === booking?.lessonId)
  const { reset: resetLesson } = useLessonStore((state) => state)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const FormSchema = z.object({
    ...(step === 3 && {
      isPassedTheoryTest: z
        .string()
        .min(1, { message: 'Theory test is required' }),
      discountTest: z.string().optional(),
      passedTheoryDate: z.string().optional(),
      startDate: z.string().min(1, { message: 'Start date is required' }),
      practicalTestDate: z
        .string()
        .min(1, { message: 'Practical test date is required' }),
      drivingExperience: z
        .string()
        .min(1, { message: 'Driving experience is required' }),
    }),
    ...(step === 4 && {
      referredFrom: z
        .string()
        .min(1, { message: 'Where did you hear from is required' }),
      discountCode: z.string().optional(),
      fullName: z.string().min(1, { message: 'Full name is required' }),
      email: z.string().email().min(1, { message: 'Email is required' }),
      address: z.string().min(1, { message: 'Address is required' }),
      address2: z.string().min(1, { message: 'Address2 is required' }),
      town: z.string().min(1, { message: 'Town is required' }),
      licenseNo: z.string().min(1, { message: 'License number is required' }),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleCheckout = (book: Booking) => {
    startTransition(async () => {
      bookLesson(book)
        .then((res) => {
          console.log({ res })
          resetLesson()
          resetBooking()
          return router.push('/booking/success')
        })
        .catch((error) => {
          setError(error?.message)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    })
  }

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (step === 3) {
      setStep(step + 1)
      setBooking(values as any)
    }

    if (step === 4) {
      setStep(step + 1)
      setBooking(values as any)
    }

    if (step === 5) {
      console.log({ booking })
      console.log({ selectedLesson })
      handleCheckout({ ...booking, ...values } as Booking)
    }
  }

  useEffect(() => {
    if (router) {
      Object.keys(booking)?.forEach((k) => {
        // @ts-ignore
        form.setValue(k, booking?.[k])
      })
    }
    // eslint-disable-next-line
  }, [router])

  const yesNoOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ]

  const discountTests = [
    { label: 'Add discounted test', value: 'true' },
    { label: "No, don't add", value: 'false' },
  ]

  return (
    <div className=''>
      {error && <Message value={error} />}
      <div className='container space-y-3 text-center md:space-y-4 lg:space-y-7'>
        <Card className='lg:w-1/2 mx-auto'>
          <CardHeader>
            <CardTitle>Complete Details</CardTitle>
            <CardDescription>
              Please fill out your details below to complete your booking
            </CardDescription>
            <CardDescription>(Step {step} / 5)</CardDescription>
          </CardHeader>
          <CardContent className='text-start'>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='text-gray-700'
            >
              <Form {...form}>
                {step === 3 && (
                  <>
                    <CustomFormField
                      form={form}
                      name='isPassedTheoryTest'
                      label='Have you passed the theory test'
                      placeholder='Have you passed the theory test'
                      fieldType='command'
                      data={yesNoOptions}
                    />
                    {form.watch('isPassedTheoryTest') === 'true' ? (
                      <CustomFormField
                        form={form}
                        name='passedTheoryDate'
                        label='Roughly what date did you pass your theory test?'
                        placeholder='Roughly what date did you pass your theory test?'
                        type='date'
                      />
                    ) : (
                      <>
                        <CardDescription>
                          $5 OFF - RRP $40 - NOW $35
                        </CardDescription>
                        <CustomFormField
                          form={form}
                          name='discountTest'
                          label='Are you sure you do not want us to book you a quicker
                            theory test?'
                          placeholder='Are you sure you do not want us to book you a quicker
                            theory test?'
                          fieldType='command'
                          data={discountTests}
                        />
                      </>
                    )}

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                      <CustomFormField
                        form={form}
                        name='startDate'
                        label='When would you like to start?'
                        placeholder='When would you like to start?'
                        type='date'
                      />

                      <CustomFormField
                        form={form}
                        name='practicalTestDate'
                        label='Choose practical test date'
                        placeholder='Choose practical test date'
                        type='date'
                      />
                    </div>

                    <CustomFormField
                      form={form}
                      name='drivingExperience'
                      label='Select driving experience'
                      placeholder='Select driving experience'
                      fieldType='command'
                      data={DrivingExperience}
                    />
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                      <CustomFormField
                        form={form}
                        name='fullName'
                        label='Full Name'
                        placeholder='Full Name'
                        type='text'
                      />

                      <CustomFormField
                        form={form}
                        name='email'
                        label='Email'
                        placeholder='Email'
                        type='email'
                      />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                      <CustomFormField
                        form={form}
                        name='licenseNo'
                        label='License'
                        placeholder='License'
                        type='text'
                      />
                      <CustomFormField
                        form={form}
                        name='address'
                        label='Address Line 1'
                        placeholder='Address Line 1'
                        type='text'
                      />
                      <CustomFormField
                        form={form}
                        name='town'
                        label='Town'
                        placeholder='Town'
                        type='text'
                      />
                      <CustomFormField
                        form={form}
                        name='address2'
                        label='Address Line 2'
                        placeholder='Address Line 2'
                        type='text'
                      />
                    </div>
                    <div className='bg-gray-100 p-3 rounded mb-3'>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                        <CustomFormField
                          form={form}
                          name='referredFrom'
                          label='How did you hear about us?'
                          placeholder='Referred From'
                          fieldType='command'
                          data={ReferredFrom}
                        />
                        <CustomFormField
                          form={form}
                          name='discountCode'
                          label='Discount Code'
                          placeholder='Discount Code'
                          type='text'
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <div className='grid grid-cols-1 gap-x-4 p-4'>
                    <PaymentForm
                      applicationId={
                        process.env.NEXT_PUBLIC_SQUARE_APP_ID as string
                      }
                      locationId={
                        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string
                      }
                      cardTokenizeResponseReceived={async (token) => {
                        const result = (await submitPayment({
                          sourceId: `${token.token}`,
                          amount: selectedLesson?.deposit || 0,
                        })) as CreatePaymentResponse

                        if (result?.payment?.status === 'COMPLETED') {
                          const submitBtn =
                            document.querySelector('.submit-button')

                          submitBtn?.click()
                        } else {
                          setError(
                            result?.errors?.[0]?.detail ||
                              'Something went wrong, please try again later'
                          )
                          setTimeout(() => {
                            setError(null)
                          }, 5000)
                        }
                      }}
                    >
                      <CreditCard />
                    </PaymentForm>
                  </div>
                )}

                <div className='space-x-5 text-center'>
                  <FormButton
                    loading={isPending}
                    label='Back'
                    type='button'
                    className={` ${
                      step === 5
                        ? 'w-[95%] mx-auto bg-background border-red-500 border text-red-500 hover:text-white'
                        : 'w-32'
                    }`}
                    variant='destructive'
                    onClick={() => {
                      if (step === 3) {
                        router.back()
                      }
                      setStep(step - 1)
                    }}
                    disabled={step <= 1}
                  />
                  <FormButton
                    loading={isPending}
                    label={step === 5 ? 'Checkout' : 'Next'}
                    type='submit'
                    className={`w-32 submit-button ${
                      step === 5 ? 'hidden' : ''
                    }`}
                    variant='outline'
                  />
                </div>
              </Form>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
