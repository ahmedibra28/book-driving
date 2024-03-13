'use client'

import useLessonStore from '@/zustand/lessonStore'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import CompleteDetails from '@/components/CompleteDetails'

export default function Page() {
  const { lessons } = useLessonStore((state) => state)
  const [error, setError] = React.useState<string | null>(null)

  const showError = () => {
    return setTimeout(() => {
      setError('Error')
    }, 2000)
  }

  return (
    <div className='container mx-auto p-4'>
      {lessons?.length > 0 && lessons[0]?.id ? (
        <CompleteDetails />
      ) : (
        <>
          {showError() && error && (
            <Alert variant='destructive'>
              <AlertTitle>No Lessons</AlertTitle>
              <AlertDescription>
                Please go to landing page and add some lessons
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
