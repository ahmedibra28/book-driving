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
import { DrivingExperience, LessonPreferences, ReferredFrom } from '@/lib/enums'
import { useRouter } from 'next/navigation'
import getLessons from '@/actions/getLessons'
import Message from '@/components/Message'
import useLessonStore from '@/zustand/lessonStore'

export default function CompleteDetails() {
  const { setBooking, booking, step, setStep } = useBookingStore(
    (state) => state
  )
  const { setLesson } = useLessonStore((state) => state)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const FormSchema = z.object({
    ...(step === 3 && {
      isPassedTheoryTest: z
        .string()
        .min(1, { message: 'Theory test result is required' }),
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
      referredFrom: z.string().min(1, { message: 'Referred from is required' }),
      discountCode: z.string().optional(),
      fullName: z.string().min(1, { message: 'Full name is required' }),
      contactNo: z.string().min(1, { message: 'Contact number is required' }),
      email: z.string().email().min(1, { message: 'Email is required' }),
      address: z.string().min(1, { message: 'Address is required' }),
      licenseNo: z.string().min(1, { message: 'License number is required' }),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleCheckout = (book: Booking) => {
    startTransition(async () => {
      getLessons(book)
        .then((res) => {
          if (!res || res?.length === 0) {
            setError('No courses found')
            setTimeout(() => {
              setError(null)
            }, 5000)
          } else {
            setLesson(res)
            return router.push('/booking')
          }
        })
        .catch((error) => {
          setError('Something went wrong, please try again later')
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
      setBooking(values as any)
      console.log({ booking })
      // handleCheckout({ ...booking, ...values } as Booking)
    }
  }

  useEffect(() => {
    if (router) {
      Object.keys(booking)?.forEach((k) => {
        // @ts-ignore
        form.setValue(k, booking?.[k])
      })

      const lessonsPref =
        booking?.lessonPreferences?.map((item) => ({
          label: item,
          value: item,
        })) || []
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
            <CardDescription>(Step {step} / 4)</CardDescription>
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
                    <CustomFormField
                      form={form}
                      name='fullName'
                      label='Full Name'
                      placeholder='Full Name'
                      type='text'
                    />
                    <CustomFormField
                      form={form}
                      name='contactNo'
                      label='Contact Number'
                      placeholder='Contact Number'
                      type='number'
                    />
                    <CustomFormField
                      form={form}
                      name='email'
                      label='Email'
                      placeholder='Email'
                      type='email'
                    />
                    <CustomFormField
                      form={form}
                      name='address'
                      label='Address'
                      placeholder='Address'
                      type='text'
                    />
                    <CustomFormField
                      form={form}
                      name='licenseNo'
                      label='License'
                      placeholder='License'
                      type='text'
                    />
                    <div className='bg-gray-100 p-3 rounded mb-3'>
                      <CustomFormField
                        form={form}
                        name='referredFrom'
                        label='Referred From'
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
                  </>
                )}

                <div className='space-x-5 text-center'>
                  <FormButton
                    loading={isPending}
                    label='Back'
                    type='button'
                    className='w-32'
                    variant='destructive'
                    onClick={() => setStep(step - 1)}
                    disabled={step <= 3}
                  />
                  <FormButton
                    loading={isPending}
                    label={step === 4 ? 'Checkout' : 'Next'}
                    type='submit'
                    className='w-32'
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
