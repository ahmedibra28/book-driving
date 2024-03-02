'use client'
import Image from 'next/image'
import React, { useState } from 'react'
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
import useBookingStore from '@/zustand/bookingStore'
import { LessonPreferences } from '@/lib/enums'

export default function Header() {
  const { setBooking, booking, step, setStep } = useBookingStore(
    (state) => state
  )
  const [selectedLessonPreference, setSelectedLessonPreference] = useState<
    { label: string; value: string }[]
  >([])

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
      fastTrackedTheoryTest: z.boolean(),
      fastTrackedDriveTest: z.boolean(),
      lessonPreferences: z.array(z.string()),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (step === 1) {
      setStep(step + 1)
      setBooking(values)
    }

    if (step === 2) {
      setBooking(values)
      console.log({ booking })
    }
  }

  const lessonTypes = [
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'INTENSIVELY', value: 'INTENSIVELY' },
  ]
  const transmissionTypes = [
    { label: 'MANUAL', value: 'MANUAL' },
    { label: 'AUTOMATIC', value: 'AUTOMATIC' },
  ]

  const multiLessonPreference = LessonPreferences?.filter(
    (item) =>
      !selectedLessonPreference?.map((item) => item.value)?.includes(item.value)
  )

  return (
    <div className='relative bg-gradient-to-r from-black to-black'>
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
              Enter your postcode and mobile number to find a driving instructor
              in your area
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
                    <div className='space-y-7 my-4'>
                      <CustomFormField
                        form={form}
                        name='fastTrackedTheoryTest'
                        label='Fast Tracked Theory Test'
                        placeholder='Fast Tracked Theory Test'
                        fieldType='checkbox'
                        labelTextColor='text-white'
                      />
                      <CustomFormField
                        form={form}
                        name='fastTrackedDriveTest'
                        label='Fast Tracked Drive Test'
                        placeholder='Fast Tracked Drive Test'
                        fieldType='checkbox'
                        labelTextColor='text-white'
                      />
                    </div>
                  </>
                )}

                <div className='space-x-5 text-center'>
                  <FormButton
                    loading={false}
                    label='Back'
                    type='button'
                    className='w-32'
                    variant='destructive'
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                  />
                  <FormButton
                    loading={false}
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
