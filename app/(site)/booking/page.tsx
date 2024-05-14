'use client'

import { FormButton } from '@/components/ui/CustomForm'
import LessonCard from '@/components/ui/LessonCard'
import useLessonStore from '@/zustand/lessonStore'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useBookingStore, { Booking } from '@/zustand/bookingStore'
import { SearchIcon } from 'lucide-react'
import getLessons from '@/actions/getLessons'
import Message from '@/components/Message'

export default function Page() {
  const { lessons, setLesson } = useLessonStore((state) => state)
  const { setStep, booking } = useBookingStore((state) => state)

  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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

  return (
    <div className='container mx-auto p-4'>
      {error && <Message value={error} />}

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
      <div className='mx-auto text-center'>
        <FormButton
          loading={isPending}
          variant='default'
          className='my-5'
          label='See more...'
          icon={<SearchIcon />}
          onClick={() =>
            handleGetLessons({ ...booking, status: 'all' } as Booking)
          }
        />
      </div>
    </div>
  )
}
