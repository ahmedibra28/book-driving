'use client'

import { FormButton } from '@/components/ui/CustomForm'
import LessonCard from '@/components/ui/LessonCard'
import useLessonStore from '@/zustand/lessonStore'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useBookingStore from '@/zustand/bookingStore'

export default function Page() {
  const { lessons } = useLessonStore((state) => state)
  const { setStep } = useBookingStore((state) => state)

  const router = useRouter()

  return (
    <div className='container mx-auto p-4'>
      <FormButton
        variant='default'
        className='mb-3'
        label='Go Back'
        icon={<FaArrowLeft />}
        onClick={() => {
          setStep(2)
          router.back()
        }}
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {lessons?.length > 0 && lessons[0]?.id ? (
          lessons?.map((lesson) => <LessonCard key={lesson.id} item={lesson} />)
        ) : (
          <Alert variant='destructive'>
            <AlertTitle>No Lessons</AlertTitle>
            <AlertDescription>
              Please go to landing page and add some lessons
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
