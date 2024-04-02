'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import type {
  Transaction as ITransaction,
  Student as IStudent,
  Lesson as ILesson,
  Instructor as IInstructor,
} from '@prisma/client'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DateTime from '@/lib/dateTime'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import useDataStore from '@/zustand/dataStore'
import { useFieldArray, useForm } from 'react-hook-form'
import FormView from '@/components/FormView'
import { WordCapitalize } from '@/lib/capitalize'
import { FormatNumber } from '@/components/FormatNumber'
import { FaX } from 'react-icons/fa6'
import { FaPlus } from 'react-icons/fa'

const FormSchema = z.object({
  instructors: z
    .array(
      z.object({
        file: z.any(),
        email: z
          .string()
          .email()
          .min(1, { message: 'Instructor email is required' }),
      })
    )
    .nonempty({ message: 'Instructor email is required' }),
})

const Page = ({ params }: { params: { id: string } }) => {
  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = useApi({
    key: ['orders', `${params.id}`],
    method: 'GET',
    url: `orders/${params.id}`,
  })?.get

  const updateApi = useApi({
    key: ['orders'],
    method: 'PUT',
    url: `orders`,
  })?.put

  const data = getApi?.data as ITransaction & {
    student: IStudent
    lesson: ILesson
    instructor: IInstructor
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      instructors: [
        {
          email: '',
        },
      ],
    },
  })

  const formArray = useFieldArray({
    name: 'instructors',
    control: form.control,
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      form.reset()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  const formFields = (
    <Form {...form}>
      {formArray.fields.map((field, index) => (
        <div
          key={field.id}
          className='flex justify-between items-center gap-x-2'
        >
          <div className='w-full'>
            <CustomFormField
              form={form}
              name={`instructors.${index}.email`}
              placeholder='Email'
              type='text'
            />
          </div>
          <Button
            type='button'
            variant='destructive'
            onClick={() => formArray.remove(index)}
            size='sm'
            className='size-9 mb-3'
          >
            <FaX />
          </Button>
          {index === formArray.fields.length - 1 && (
            <Button
              type='button'
              onClick={() => formArray.append({ email: '' })}
              className='gap-x-1 mb-3'
              size='sm'
            >
              <FaPlus /> Append
            </Button>
          )}
        </div>
      ))}
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log({
      id: params.id,
      ...values,
    })
    updateApi?.mutateAsync({
      id: params.id,
      ...values,
    })
  }

  return (
    <>
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={'Instructors'}
        edit={false}
      />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='space-y-4 py-4'>
          <Card className='w-full max-w-3xl mx-auto'>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                These are the information of the student
              </CardDescription>
            </CardHeader>
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
                  <dd className='font-medium'>{data?.student?.contactNo}</dd>
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
                  <dd className='font-medium'>{data?.student?.postalCode}</dd>
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
          </Card>

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
                    Course Status
                  </dt>
                  <dd className='font-medium'>
                    {data?.status === 'ACTIVE' ? (
                      <span className='text-green-500'>{data?.status}</span>
                    ) : data?.status === 'PENDING' ? (
                      <span className='text-blue-500'>{data?.status}</span>
                    ) : data?.status === 'EMAIL_SENT' ? (
                      <span className='text-orange-500'>
                        {data?.status?.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className='text-red-500'>{data?.status}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className='w-full max-w-3xl mx-auto'>
            <CardHeader>
              <CardTitle>Other</CardTitle>
              <CardDescription>These are the other details</CardDescription>
            </CardHeader>
            <CardContent className='border-t pt-4'>
              <ul className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Instructor Price
                  </dt>
                  <dd className='font-medium'>
                    <FormatNumber value={data?.lesson?.instructorPrice} />
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Deposit Price
                  </dt>
                  <dd className='font-medium'>
                    <FormatNumber value={data?.lesson?.deposit} />
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Discount Code
                  </dt>
                  <dd className='font-medium'>{data?.discountCode || '---'}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Instructor Name
                  </dt>
                  <dd className='font-medium'>
                    {data?.instructor?.fullName || '---'}
                  </dd>
                </div>
              </ul>
            </CardContent>
          </Card>

          <Card className='w-full max-w-3xl mx-auto'>
            <CardFooter className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5'>
              {data?.status !== 'INACTIVE' && (
                <Button
                  onClick={() => console.log('refunding...')}
                  variant='destructive'
                  className='w-full md:w-1/3'
                >
                  Refund
                </Button>
              )}
              {(data?.status === 'PENDING' ||
                data?.status === 'EMAIL_SENT') && (
                <>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className='w-full md:w-1/2'
                  >
                    {data?.status === 'EMAIL_SENT'
                      ? ' Resend To Email'
                      : ' Send To Email'}
                  </Button>
                  {data?.invitations?.map((item) => (
                    <ul key={item} className='list-decimal pl-3'>
                      <li className='text-xs'>{item}</li>
                      <br />
                    </ul>
                  ))}
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
