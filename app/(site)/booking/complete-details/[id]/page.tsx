'use client'

import { FormButton } from '@/components/ui/CustomForm'
import useLessonStore from '@/zustand/lessonStore'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import CompleteDetails from '@/components/CompleteDetails'

export default function Page() {
  const { lessons } = useLessonStore((state) => state)

  const router = useRouter()

  return (
    <div className='container mx-auto p-4'>
      <FormButton
        variant='default'
        className='mb-3'
        label='Go Back'
        icon={<FaArrowLeft />}
        onClick={() => router.back()}
      />
      {lessons?.length > 0 && lessons[0]?.id ? (
        <CompleteDetails />
      ) : (
        <Alert variant='destructive'>
          <AlertTitle>No Lessons</AlertTitle>
          <AlertDescription>
            Please go to landing page and add some lessons
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}