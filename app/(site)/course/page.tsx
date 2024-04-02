'use client'

import React, { useState, useEffect, useTransition } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'

import { TopLoadingBar } from '@/components/TopLoadingBar'
import getMyCourses from '@/actions/getMyCourses'
import useUserInfoStore from '@/zustand/userStore'
import { MyCourseProp } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DateTime from '@/lib/dateTime'
import { WordCapitalize } from '@/lib/capitalize'
import { Button } from '@/components/ui/button'
import { FormatNumber } from '@/components/FormatNumber'

const Page = () => {
  const [isPending, startTransition] = useTransition()
  const { email } = useUserInfoStore((state) => state.userInfo)
  const [courses, setCourses] = useState<MyCourseProp[]>([])
  const [error, setError] = useState<string | null>(null)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  useEffect(() => {
    if (email) {
      startTransition(async () => {
        getMyCourses(email)
          .then((res) => {
            setCourses(res)
          })
          .catch((error) => {
            setError('Something went wrong, please try again later')
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      })
    }
  }, [])

  return (
    <>
      <TopLoadingBar isFetching={isPending} />

      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message value={error} />
      ) : (
        courses?.map((data, i) => (
          <div
            key={i}
            className='space-y-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          >
            <Card className='w-full max-w-3xl mx-auto'>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
                <CardDescription>
                  These are the details of the lesson
                </CardDescription>
              </CardHeader>
              <CardContent className='border-t pt-4'>
                <dl className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Lesson Type
                    </dt>
                    <dd className='font-medium'>{data?.lesson?.lessonType}</dd>
                  </div>
                  {data?.isPassedTheoryTest && (
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Passed Theory Date
                      </dt>
                      <dd className='font-medium'>
                        {DateTime(data?.passedTheoryDate).format('YYYY-MM-DD')}
                      </dd>
                    </div>
                  )}
                  <div className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Start Date
                    </dt>
                    <dd className='font-medium'>
                      {DateTime(data?.startDate).format('YYYY-MM-DD')}
                    </dd>
                  </div>
                  <div className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Practical Test Date
                    </dt>
                    <dd className='font-medium'>
                      {DateTime(data?.practicalTestDate).format('YYYY-MM-DD')}
                    </dd>
                  </div>
                  <div className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Driving Experience
                    </dt>
                    <dd className='font-medium'>
                      {WordCapitalize(
                        data?.drivingExperience
                          ?.replaceAll('I_HAVE_', ' ')
                          ?.replaceAll('I_AM_', ' ')
                          ?.replaceAll('_', ' ') || ''
                      )}
                    </dd>
                  </div>
                  <div className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Instructor Price
                    </dt>
                    <dd className='font-medium'>
                      <FormatNumber value={data?.lesson?.instructorPrice} />
                    </dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <div className='mx-auto'>
                  <hr className='my-4 border-0.5 border-gray-200 w-full' />
                  <dd className='font-medium space-x-2 flex items-center'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => console.log('reject')}
                      className=' w-full'
                    >
                      REJECT
                    </Button>
                    <Button
                      onClick={() => console.log('accept')}
                      size='sm'
                      className='w-full'
                    >
                      ACCEPT
                    </Button>
                  </dd>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
