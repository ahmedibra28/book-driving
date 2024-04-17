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
import { FormatNumber } from '@/components/FormatNumber'
import updateLessonStatus from '@/actions/updateLessonStatus'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { FaSpinner } from 'react-icons/fa6'
import ConfirmDialog from '@/components/ConfirmDialog'
import { FaArrowLeft } from 'react-icons/fa6'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

  const fetchCourses = () =>
    startTransition(async () => {
      getMyCourses(email)
        .then((res) => {
          setCourses(res)
        })
        .catch(() => {
          setError('Something went wrong, please try again later')
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    })

  useEffect(() => {
    if (email) fetchCourses()
  }, [])

  const updateCourse = ({
    id,
    status,
    email,
  }: {
    id: string
    status: string
    email: string
  }) => {
    startTransition(async () => {
      updateLessonStatus(id, status, email)
        .then(() => {
          fetchCourses()
        })
        .catch((error) => {
          setError(error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    })
  }

  return (
    <>
      <TopLoadingBar isFetching={isPending} />

      {!isPending && courses?.length < 1 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 self-center'>
          <Alert className='mt-5' variant='destructive'>
            <AlertTitle>No courses found</AlertTitle>
            <AlertDescription>
              There is no course shared with you
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isPending ? (
        <Spinner />
      ) : error ? (
        <Message value={error} />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3'>
          {courses?.map((data, i) => (
            <Card
              key={i}
              className='w-full max-w-3xl mx-auto relative overflow-hidden'
            >
              <div
                className={`absolute top-7 -right-11 ${
                  data?.status === 'EMAIL_SENT' ? 'bg-green-500' : 'bg-gray-500'
                } p-2 rotate-45 w-44 text-center text-xs mx-auto text-white`}
              >
                {data?.status === 'EMAIL_SENT'
                  ? 'New Course'
                  : 'Course Completed'}
              </div>
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
                <CardDescription>
                  These are the details of the lesson
                </CardDescription>
              </CardHeader>
              {data?.status !== 'EMAIL_SENT' && (
                <CardContent className='border-t pt-4'>
                  <dl className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Full Name
                      </dt>
                      <dd className='font-medium'>{data?.student?.fullName}</dd>
                    </div>

                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Contact No
                      </dt>
                      <dd className='font-medium'>
                        {data?.student?.contactNo}
                      </dd>
                    </div>
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Email
                      </dt>
                      <dd className='font-medium'>{data?.student?.email}</dd>
                    </div>
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Postal Code
                      </dt>
                      <dd className='font-medium'>
                        {data?.student?.postalCode}
                      </dd>
                    </div>
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Town
                      </dt>
                      <dd className='font-medium'>{data?.student?.town}</dd>
                    </div>
                    <div className='space-y-1'>
                      <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Address
                      </dt>
                      <dd className='font-medium'>{data?.student?.address}</dd>
                    </div>
                  </dl>
                </CardContent>
              )}

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

              {data?.status === 'EMAIL_SENT' && (
                <CardFooter>
                  <div className='mx-auto'>
                    <hr className='my-4 border-0.5 border-gray-200 w-full' />
                    <dd className='font-medium space-x-2 flex items-center'>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <div className='flex h-8 w-full min-w-32 items-center justify-center gap-x-1 rounded px-2 text-sm text-red-500 hover:bg-slate-100'>
                            {isPending ? (
                              <>
                                <FaSpinner className='mr-1 animate-spin' />
                                Loading
                              </>
                            ) : (
                              <span>REJECT</span>
                            )}
                          </div>
                        </AlertDialogTrigger>
                        <ConfirmDialog
                          message='This action cannot be undone. Are you sure you want to reject this course?'
                          onClick={() =>
                            updateCourse({
                              id: data?.id,
                              status: 'INACTIVE',
                              email,
                            })
                          }
                        />
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <div className='flex h-8 w-full min-w-32 items-center justify-center gap-x-1 rounded px-2 text-sm text-white bg-gray-900'>
                            {isPending ? (
                              <>
                                <FaSpinner className='mr-1 animate-spin' />
                                Loading
                              </>
                            ) : (
                              <span>ACCEPT</span>
                            )}
                          </div>
                        </AlertDialogTrigger>
                        <ConfirmDialog
                          message='This action cannot be undone. Are you sure you want to accept this course?'
                          onClick={() =>
                            updateCourse({
                              id: data?.id,
                              status: 'ACTIVE',
                              email,
                            })
                          }
                        />
                      </AlertDialog>
                    </dd>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
