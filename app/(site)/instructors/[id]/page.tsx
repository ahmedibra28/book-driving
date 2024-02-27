'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import type { Instructor as IInstructor } from '@prisma/client'
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
import { useForm } from 'react-hook-form'
import FormView from '@/components/FormView'
import { FileIcon } from 'lucide-react'

const FormSchema = z.object({
  note: z.string().refine((value) => value !== '', {
    message: 'Note is required',
  }),
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
    key: ['instructors', `${params.id}`],
    method: 'GET',
    url: `instructors/${params.id}`,
  })?.get

  const updateApi = useApi({
    key: ['instructors'],
    method: 'PUT',
    url: `instructors`,
  })?.put

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  const data = getApi?.data as IInstructor

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: '',
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name='note'
        label='Note'
        placeholder='Note'
        cols={6}
        rows={3}
      />
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    updateApi?.mutateAsync({
      id: params.id,
      status: 'REJECTED',
      ...values,
    })
  }

  const onApprove = () => {
    updateApi?.mutateAsync({
      id: params.id,
      status: 'APPROVED',
      note: '',
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
        label={'Reject'}
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
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal information as provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className='border-t pt-4'>
              <dl className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Full Name
                  </dt>
                  <dd className='font-medium'>{data?.fullName}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Contact No
                  </dt>
                  <dd className='font-medium'>{data?.contactNo}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Date of Birth
                  </dt>
                  <dd className='font-medium'>
                    {' '}
                    {DateTime(data?.dateOfBirth).format('YYYY-MM-DD')}
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Address
                  </dt>
                  <dd className='font-medium'>
                    {data?.address}, {data?.street}, {data?.city},{' '}
                    {data?.postalCode}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className='w-full max-w-3xl mx-auto'>
            <CardHeader>
              <CardTitle>Driving Instructor Details</CardTitle>
              <CardDescription>
                Your driving instructor details as provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className='border-t pt-4'>
              <dl className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Driving License No
                  </dt>
                  <dd className='font-medium'>{data?.drivingLicenseNo}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    License Expire Date
                  </dt>
                  <dd className='font-medium'>
                    {DateTime(data?.licenseExpiryDate).format('YYYY-MM-DD')}
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Qualifications
                  </dt>
                  <dd className='font-medium'>{data?.qualification}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Specialization
                  </dt>
                  <dd className='font-medium'>{data?.specialization}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Vehicle Registration No
                  </dt>
                  <dd className='font-medium'>{data?.vehicleRegistrationNo}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Make & Model of Vehicle
                  </dt>
                  <dd className='font-medium'>{data?.vehicleModel}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className='w-full max-w-3xl mx-auto'>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                Your uploaded documents as provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className='border-t pt-4'>
              <ul className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
                <li className='flex items-center space-x-2'>
                  <FileIcon className='w-4 h-4 flex-shrink-0' />
                  <span>Driving License File:</span>
                  <a
                    className='ml-auto underline'
                    href={data?.drivingLicenseFile}
                    target='_blank'
                  >
                    View
                  </a>
                </li>
                <li className='flex items-center space-x-2'>
                  <FileIcon className='w-4 h-4 flex-shrink-0' />
                  <span>Vehicle Registration File:</span>
                  <a
                    className='ml-auto underline'
                    href={data?.vehicleRegistrationFile}
                    target='_blank'
                  >
                    View
                  </a>
                </li>
                <li className='flex items-center space-x-2'>
                  <FileIcon className='w-4 h-4 flex-shrink-0' />
                  <span>Proof of Insurance File:</span>
                  <a
                    className='ml-auto underline'
                    href={data?.proofOfInsuranceFile}
                    target='_blank'
                  >
                    View
                  </a>
                </li>
                <li className='flex items-center space-x-2'>
                  <FileIcon className='w-4 h-4 flex-shrink-0' />
                  <span>DBS Certificate File:</span>
                  <a
                    className='ml-auto underline'
                    href={data?.dbsCertificateFile}
                    target='_blank'
                  >
                    View
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='w-full max-w-3xl mx-auto'>
            <CardFooter className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5'>
              {data?.status !== 'REJECTED' && (
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant='destructive'
                  className='w-full md:w-1/3'
                >
                  Reject
                </Button>
              )}
              {data?.status !== 'APPROVED' && (
                <Button onClick={() => onApprove()} className='w-full md:w-1/3'>
                  Approve
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
