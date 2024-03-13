'use client'
import Image from 'next/image'
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
import CustomFormField, {
  FormButton,
  MultiSelect,
} from '@/components/ui/CustomForm'
import useBookingStore, { Booking } from '@/zustand/bookingStore'
import { LessonPreferences, PreviousDrivingExperience } from '@/lib/enums'
import { useRouter } from 'next/navigation'
import getLessons from '@/actions/getLessons'
import Message from '@/components/Message'
import useLessonStore from '@/zustand/lessonStore'

export default function Header() {
  const { setBooking, booking, step, setStep } = useBookingStore(
    (state) => state
  )
  const { setLesson } = useLessonStore((state) => state)

  const [selectedLessonPreference, setSelectedLessonPreference] = useState<
    { label: string; value: string }[]
  >([])
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const FormSchema = z.object({
    ...(step === 1 && {
      postalCode: z.string().refine((value) => value !== '', {
        message: 'Postal code is required',
      }),
      mobile: z.string().refine((value) => value !== '', {
        message: 'Mobile is required',
      }),
    }),
    ...(step === 2 && {
      lessonType: z.string(),
      transmissionType: z.string(),
      fastTrackedTheoryTest: z.boolean().optional(),
      fastTrackedDriveTest: z.boolean().optional(),
      ultimateTheoryPackage: z.boolean().optional(),
      lessonPreferences: z.array(z.string()),
      previousDrivingExperience: z.string(),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleGetLessons = (book: Booking) => {
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
    if (step === 1) {
      setStep(step + 1)
      setBooking(values as any)
    }

    if (step === 2) {
      setBooking(values as any)
      handleGetLessons({ ...booking, ...values } as Booking)
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

      setSelectedLessonPreference(lessonsPref)
    }
    // eslint-disable-next-line
  }, [router])

  const lessonTypes = [
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Intensively', value: 'INTENSIVELY' },
  ]
  const transmissionTypes = [
    { label: 'Manual', value: 'MANUAL' },
    { label: 'Automatic', value: 'AUTOMATIC' },
  ]

  const multiLessonPreference = LessonPreferences?.filter(
    (item) =>
      !selectedLessonPreference?.map((item) => item.value)?.includes(item.value)
  )

  return (
    <div className='relative bg-gradient-to-r from-black to-black'>
      {error && <Message value={error} />}
      <Image
        src='https://plus.unsplash.com/premium_photo-1682088541985-5b226a4867e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='hero'
        width={1920}
        height={1080}
        className='object-cover opacity-50 shadow-lg lg:h-[84vh]'
      />
      <div className='container absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform space-y-3 text-center text-white md:space-y-4 lg:space-y-7'>
        <Card className='lg:w-1/2 mx-auto bg-transparent text-white shadow-2xl shadow-white bg-gradient-to-r from-black/50 to-white/50'>
          <CardHeader>
            <CardTitle>Find a Driving Instructor</CardTitle>
            <CardDescription className='text-gray-200'>
              {step === 1
                ? 'Enter your postcode and mobile number to find a driving instructor in your area'
                : 'Please fill out the form below to book a driving lesson'}
            </CardDescription>
            <CardDescription className='text-gray-200'>
              (Step {step} / 4)
            </CardDescription>
          </CardHeader>
          <CardContent className='text-start'>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='text-gray-700'
            >
              <Form {...form}>
                {step === 1 && (
                  <>
                    <CustomFormField
                      form={form}
                      name='postalCode'
                      label='Postal Code'
                      placeholder='Postal code'
                      type='text'
                      labelTextColor='text-white'
                    />
                    <CustomFormField
                      form={form}
                      name='mobile'
                      label='Mobile'
                      placeholder='Mobile'
                      type='number'
                      labelTextColor='text-white'
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4'>
                      <CustomFormField
                        form={form}
                        name='lessonType'
                        label='Lesson Type'
                        placeholder='Lesson Type'
                        fieldType='command'
                        data={lessonTypes}
                        labelTextColor='text-white'
                      />
                      <CustomFormField
                        form={form}
                        name='transmissionType'
                        label='Transmission Type'
                        placeholder='Transmission Type'
                        fieldType='command'
                        data={transmissionTypes}
                        labelTextColor='text-white'
                      />
                    </div>
                    <MultiSelect
                      form={form}
                      name='lessonPreferences'
                      label='Lesson Preferences'
                      data={multiLessonPreference}
                      selected={selectedLessonPreference}
                      setSelected={setSelectedLessonPreference}
                      edit={false}
                      labelTextColor='text-white'
                    />
                    <CustomFormField
                      form={form}
                      name='previousDrivingExperience'
                      label='Previous Driving Experience'
                      placeholder='Previous Driving Experience'
                      fieldType='command'
                      data={PreviousDrivingExperience}
                      labelTextColor='text-white'
                    />
                    <div className='space-y-7 my-4 mt-7'>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                        <CustomFormField
                          form={form}
                          name='fastTrackedTheoryTest'
                          label='Fast Tracked Theory Test'
                          placeholder='Fast Tracked Theory Test'
                          fieldType='checkbox'
                          labelTextColor='text-white'
                        />
                        {form.watch('fastTrackedTheoryTest') && (
                          <CustomFormField
                            form={form}
                            name='ultimateTheoryPackage'
                            label='Ultimate Theory Package'
                            placeholder='Ultimate Theory Package'
                            fieldType='checkbox'
                          />
                        )}
                        <CustomFormField
                          form={form}
                          name='fastTrackedDriveTest'
                          label='Fast Tracked Drive Test'
                          placeholder='Fast Tracked Drive Test'
                          fieldType='checkbox'
                          labelTextColor='text-white'
                        />
                      </div>
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
                    disabled={step === 1}
                  />
                  <FormButton
                    loading={isPending}
                    label={step === 2 ? 'Submit' : 'Next'}
                    type='submit'
                    className='w-32 bg-transparent text-white'
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
