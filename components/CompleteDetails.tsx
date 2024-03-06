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
import {
  DrivingExperience,
  LessonPreferences,
  PreviousDrivingExperience,
} from '@/lib/enums'
import { useRouter } from 'next/navigation'
import getLessons from '@/actions/getLessons'
import Message from '@/components/Message'
import useLessonStore from '@/zustand/lessonStore'

export default function CompleteDetails() {
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
      // setStep(step + 1)
      // setBooking(values as any)
    }

    if (step === 2) {
      // setBooking(values as any)
      // handleGetLessons({ ...booking, ...values } as Booking)
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
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'INTENSIVELY', value: 'INTENSIVELY' },
  ]
  const transmissionTypes = [
    { label: 'MANUAL', value: 'MANUAL' },
    { label: 'AUTOMATIC', value: 'AUTOMATIC' },
  ]

  const yesNoOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ]

  const discountTests = [
    { label: 'Add discounted test', value: 'true' },
    { label: "No, don't add", value: 'false' },
  ]

  const multiLessonPreference = LessonPreferences?.filter(
    (item) =>
      !selectedLessonPreference?.map((item) => item.value)?.includes(item.value)
  )

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
            <CardDescription>(Step {step} / 2)</CardDescription>
          </CardHeader>
          <CardContent className='text-start'>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='text-gray-700'
            >
              <Form {...form}>
                {/* {step === 1 && ( */}
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
                {/* )} */}

                {step === 24 && (
                  <>
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
