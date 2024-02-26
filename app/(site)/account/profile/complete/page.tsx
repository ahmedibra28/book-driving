'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import useApi from '@/hooks/useApi'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import useUserInfoStore from '@/zustand/userStore'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton, Upload } from '@/components/ui/CustomForm'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'
import { FaAnglesRight } from 'react-icons/fa6'
import type { User as IUser, Instructor as IInstructor } from '@prisma/client'
import DateTime from '@/lib/dateTime'

const Profile = () => {
  const [step, setStep] = React.useState(1)

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get
  const updateApi = useApi({
    key: ['profiles'],
    method: 'PUT',
    url: `profile/complete`,
  })?.put

  const FormSchema = z.object({
    ...(step === 1 && {
      address: z.string(),
      fullName: z.string(),
      dateOfBirth: z.string(),
      contactNo: z.string(),
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
    }),
    ...(step === 2 && {
      drivingLicenseNo: z.string(),
      licenseExpiryDate: z.string(),
      qualification: z.string(),
      yearsOfExperience: z.string(),
      specialization: z.string(),
      vehicleRegistrationNo: z.string(),
      vehicleModel: z.string(),
    }),
    ...(step === 3 && {
      drivingLicenseFile: z.array(z.string()),
      vehicleRegistrationFile: z.array(z.string()),
      proofOfInsuranceFile: z.array(z.string()),
      dbsCertificateFile: z.array(z.string()),
      termAndCondition: z.boolean().optional(),
    }),
    ...(step === 4 && {
      address: z.string(),
      fullName: z.string(),
      dateOfBirth: z.string(),
      contactNo: z.string(),
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
      drivingLicenseNo: z.string(),
      licenseExpiryDate: z.string(),
      qualification: z.string(),
      yearsOfExperience: z.string(),
      specialization: z.string(),
      vehicleRegistrationNo: z.string(),
      vehicleModel: z.string(),
      drivingLicenseFile: z.array(z.string()),
      vehicleRegistrationFile: z.array(z.string()),
      proofOfInsuranceFile: z.array(z.string()),
      dbsCertificateFile: z.array(z.string()),
      termAndCondition: z.boolean().optional(),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (step < 4) return setStep(step + 1)
    updateApi?.mutateAsync({
      ...values,
      id: userInfo.id,
    })
  }

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      const { name, mobile, image } = updateApi?.data
      updateUserInfo({
        ...userInfo,
        name,
        mobile,
        image,
      })
      form.reset()

      router.push('/')
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  const profile = getApi?.data as IUser & { instructor: IInstructor }
  const status = profile?.instructor?.status

  useEffect(() => {
    if (getApi?.isSuccess && userInfo.role === 'INSTRUCTOR') {
      if (['APPROVED', 'PENDING'].includes(status)) router.push('/')
    }

    // eslint-disable-next-line
  }, [getApi?.isSuccess])

  useEffect(() => {
    if (profile?.instructor?.status === 'REJECTED' && getApi?.isSuccess) {
      const { instructor } = profile
      Object.keys(instructor).forEach((key) => {
        // @ts-ignore
        form.setValue(key, instructor?.[key])
        // @ts-ignore
        form.setValue(
          'dateOfBirth',
          // @ts-ignore
          DateTime(instructor?.dateOfBirth).format('YYYY-MM-DD')
        )
        // @ts-ignore
        form.setValue(
          'licenseExpiryDate',
          // @ts-ignore
          DateTime(instructor?.licenseExpiryDate).format('YYYY-MM-DD')
        )

        // @ts-ignore
        form.setValue('yearsOfExperience', `${instructor?.yearsOfExperience}`)
        // @ts-ignore
        form.setValue('drivingLicenseFile', [instructor?.drivingLicenseFile])
        // @ts-ignore
        form.setValue('vehicleRegistrationFile', [
          instructor?.vehicleRegistrationFile,
        ])
        // @ts-ignore
        form.setValue('proofOfInsuranceFile', [
          instructor?.proofOfInsuranceFile,
        ])
        // @ts-ignore
        form.setValue('dbsCertificateFile', [instructor?.dbsCertificateFile])
      })
    }
    // eslint-disable-next-line
  }, [getApi?.isSuccess])

  const stepper = ({
    num,
    label,
    hideArrow = false,
  }: {
    num: number
    label: string
    hideArrow?: boolean
  }) => (
    <li
      className={`flex items-center ${
        step >= num ? 'text-green-500' : 'text-gray-500'
      }`}
    >
      <span
        className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
          step >= num ? 'border-green-500' : 'border-gray-500'
        } rounded-full shrink-0 ${
          step >= num ? 'text-green-500' : 'text-gray-500'
        }`}
      >
        {num}
      </span>
      <span className='hidden md:flex'>{label}</span>
      {!hideArrow && <FaAnglesRight className='text-sm ml-2' />}
    </li>
  )

  return (
    <div className='max-w-6xl mx-auto bg-whites p-3 mt-2'>
      {updateApi?.isError && <Message value={updateApi?.error} />}

      {getApi?.isError && <Message value={getApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}

      {getApi?.isPending && <Spinner />}

      <div className='bg-opacity-60 max-w-4xl mx-auto'>
        {profile?.instructor?.note && (
          <div className='text-red-500 mb-2'>{profile?.instructor?.note}</div>
        )}
        <Card className='w-full mx-w-3xl lg:max-w-5xl mx-auto'>
          {userInfo.role === 'INSTRUCTOR' &&
            !['APPROVED', 'PENDING'].includes(status) && (
              <CardHeader>
                <CardTitle>Complete your account</CardTitle>
                <CardDescription>
                  Please fill out the form to complete your account.
                </CardDescription>

                <ol className='flex items-center justify-between w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 sm:text-base sm:p-4 sm:space-x-4 rtl:space-x-reverse border-b'>
                  {stepper({
                    num: 1,
                    label: 'Personal',
                  })}

                  {stepper({
                    num: 2,
                    label: 'Driving',
                  })}

                  {stepper({
                    num: 3,
                    label: 'Documents',
                  })}
                  {stepper({
                    num: 4,
                    label: 'Summary',
                    hideArrow: true,
                  })}
                </ol>
              </CardHeader>
            )}

          <CardContent className='space-y-6 py-5'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {userInfo.role === 'INSTRUCTOR' &&
                  !['APPROVED', 'PENDING'].includes(status) && (
                    <div>
                      {step === 1 && (
                        <>
                          <CardTitle className='text-lg'>
                            Personal Information
                          </CardTitle>
                          <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-y-1 gap-x-4'>
                            <CustomFormField
                              form={form}
                              name='fullName'
                              label='Name'
                              placeholder='Enter name'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='dateOfBirth'
                              label='Date of Birth'
                              placeholder='Enter date of birth'
                              type='date'
                            />
                            <CustomFormField
                              form={form}
                              name='contactNo'
                              label='Mobile'
                              placeholder='Enter mobile'
                              type='number'
                            />
                            <CustomFormField
                              form={form}
                              name='address'
                              label='Address'
                              placeholder='Enter address'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='street'
                              label='Street'
                              placeholder='Enter street'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='city'
                              label='City'
                              placeholder='Enter city'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='postalCode'
                              label='Postal Code'
                              placeholder='Enter postal code'
                              type='text'
                            />
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <CardTitle className='text-lg'>
                            Driving Instructor Details
                          </CardTitle>
                          <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-y-1 gap-x-4'>
                            <CustomFormField
                              form={form}
                              name='drivingLicenseNo'
                              label='License No'
                              placeholder='Enter license no'
                              type='number'
                            />
                            <CustomFormField
                              form={form}
                              name='licenseExpiryDate'
                              label='License Expiry Date'
                              placeholder='Enter license expiry date'
                              type='date'
                            />
                            <CustomFormField
                              form={form}
                              name='qualification'
                              label='Qualification'
                              placeholder='Enter qualification'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='specialization'
                              label='Specialization'
                              placeholder='Enter specialization'
                              type='text'
                            />
                            <CustomFormField
                              form={form}
                              name='yearsOfExperience'
                              label='Year of experience'
                              placeholder='Enter year of experience'
                              type='number'
                            />
                            <CustomFormField
                              form={form}
                              name='vehicleRegistrationNo'
                              label='Vehicle Registration No'
                              placeholder='Enter vehicle registration no'
                              type='number'
                            />
                            <CustomFormField
                              form={form}
                              name='vehicleModel'
                              label='Make and Model of Vehicle'
                              placeholder='Enter vehicle model'
                              type='text'
                            />
                          </div>
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <CardTitle className='text-lg'>
                            Upload Documents
                          </CardTitle>
                          <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-y-3 gap-x-4 text-gray-700'>
                            <div>
                              <Upload
                                label='Driving License'
                                fileType='image'
                                form={form}
                                name='drivingLicenseFile'
                              />
                              {form.watch('drivingLicenseFile') && (
                                <a
                                  href={form.watch('drivingLicenseFile')?.[0]}
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-primary text-xs underline pl-3'
                                >
                                  View file
                                </a>
                              )}
                            </div>
                            <div>
                              <Upload
                                label='Vehicle Registration'
                                fileType='image'
                                form={form}
                                name='vehicleRegistrationFile'
                              />
                              {form.watch('vehicleRegistrationFile') && (
                                <a
                                  href={
                                    form.watch('vehicleRegistrationFile')?.[0]
                                  }
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-primary text-xs underline pl-3'
                                >
                                  View file
                                </a>
                              )}
                            </div>
                            <div>
                              <Upload
                                label='Proof of Insurance'
                                fileType='image'
                                form={form}
                                name='proofOfInsuranceFile'
                              />
                              {form.watch('proofOfInsuranceFile') && (
                                <a
                                  href={form.watch('proofOfInsuranceFile')?.[0]}
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-primary text-xs underline pl-3'
                                >
                                  View file
                                </a>
                              )}
                            </div>
                            <div>
                              <Upload
                                label='CRP/DBS Check Certificate'
                                fileType='image'
                                form={form}
                                name='dbsCertificateFile'
                              />
                              {form.watch('dbsCertificateFile') && (
                                <a
                                  href={form.watch('dbsCertificateFile')?.[0]}
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-primary text-xs underline pl-3'
                                >
                                  View file
                                </a>
                              )}
                            </div>
                          </div>
                          <div className='grid grid-cols-1'>
                            <CustomFormField
                              form={form}
                              name='termAndCondition'
                              label='Terms and Conditions'
                              type='text'
                              fieldType='checkbox'
                            />
                            <CardDescription className='mb-5'>
                              By submitting this form, I confirm that all the I
                              agree to abide by the rules and regulations set
                              forth by book driving Ltd and understand that any
                              misrepresentation may lead to the termination of
                              my registration.
                            </CardDescription>
                          </div>
                        </>
                      )}

                      {step === 4 && (
                        <>
                          <CardTitle className='text-lg'>Summary</CardTitle>
                          <CardDescription>
                            Summary of your account details
                          </CardDescription>

                          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                            <Card>
                              <CardHeader className='pb-2'>
                                <CardTitle className='text-md'>
                                  Personal Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Full Name:
                                  </span>
                                  <span>{form.watch('fullName')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Contact No:
                                  </span>
                                  <span>{form.watch('contactNo')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Date of Birth:
                                  </span>
                                  <span>{form.watch('dateOfBirth')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Address{' '}
                                  </span>
                                  <span>{form.watch('address')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Street:{' '}
                                  </span>
                                  <span>{form.watch('street')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>City: </span>
                                  <span>{form.watch('city')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Postal Code:
                                  </span>
                                  <span>{form.watch('postalCode')}</span>
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
                                  <span className='font-bold pr-2'>
                                    Driving License No:
                                  </span>
                                  <span>{form.watch('drivingLicenseNo')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    License Expire Date:
                                  </span>
                                  <span>{form.watch('licenseExpiryDate')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Qualifications:
                                  </span>
                                  <span>{form.watch('qualification')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Specialization:
                                  </span>
                                  <span>{form.watch('specialization')}</span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Vehicle Registration No:
                                  </span>
                                  <span>
                                    {form.watch('vehicleRegistrationNo')}
                                  </span>
                                </p>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Make & Model of Vehicle
                                  </span>
                                  <span>{form.watch('vehicleModel')}</span>
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className='pb-2'>
                                <CardTitle className='text-md'>
                                  Uploaded Documents
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className='text-sm'>
                                  <span className='font-bold pr-2'>
                                    Driving License File:
                                  </span>
                                  <span>
                                    <a
                                      href={form.watch('drivingLicenseFile')}
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
                                      href={form.watch(
                                        'vehicleRegistrationFile'
                                      )}
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
                                      href={form.watch('proofOfInsuranceFile')}
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
                                      href={form.watch('dbsCertificateFile')}
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
                        </>
                      )}

                      <div className='space-x-5 text-center'>
                        <FormButton
                          loading={updateApi?.isPending}
                          label='Back'
                          type='button'
                          className='w-28'
                          variant='destructive'
                          onClick={() => setStep(step - 1)}
                          disabled={step === 1}
                        />
                        <FormButton
                          loading={updateApi?.isPending}
                          label={step === 4 ? 'Submit' : 'Next'}
                          className='w-28'
                          type='submit'
                        />
                      </div>
                    </div>
                  )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})
