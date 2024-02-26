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
        <Card className='mt-2'>
          <CardHeader>
            <CardTitle>{data?.fullName}</CardTitle>
            <CardDescription>
              This instructor is {data?.status?.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-md'>
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Full Name:</span>
                    <span>{data?.fullName}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Contact No:</span>
                    <span>{data?.contactNo}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Date of Birth:</span>
                    <span>
                      {DateTime(data?.dateOfBirth).format('YYYY-MM-DD')}
                    </span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Address </span>
                    <span>{data?.address}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Street: </span>
                    <span>{data?.street}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>City: </span>
                    <span>{data?.city}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Postal Code:</span>
                    <span>{data?.postalCode}</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-md'>
                    Driving Instructor Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Driving License No:</span>
                    <span>{data?.drivingLicenseNo}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>License Expire Date:</span>
                    <span>
                      {DateTime(data?.licenseExpiryDate).format('YYYY-MM-DD')}
                    </span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Qualifications:</span>
                    <span>{data?.qualification}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>Specialization:</span>
                    <span>{data?.specialization}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      Vehicle Registration No:
                    </span>
                    <span>{data?.vehicleRegistrationNo}</span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      Make & Model of Vehicle
                    </span>
                    <span>{data?.vehicleModel}</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-md'>Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      Driving License File:
                    </span>
                    <span>
                      <a
                        href={data?.drivingLicenseFile}
                        target='_blank'
                        className='underline'
                      >
                        View
                      </a>
                    </span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      Vehicle Registration File:
                    </span>
                    <span>
                      <a
                        href={data?.vehicleRegistrationFile}
                        target='_blank'
                        className='underline'
                      >
                        View
                      </a>
                    </span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      Proof of Insurance File:
                    </span>
                    <span>
                      <a
                        href={data?.proofOfInsuranceFile}
                        target='_blank'
                        className='underline'
                      >
                        View
                      </a>
                    </span>
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold pr-2'>
                      DBS Certificate File:
                    </span>
                    <span>
                      <a
                        href={data?.dbsCertificateFile}
                        target='_blank'
                        className='underline'
                      >
                        View
                      </a>
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
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
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
