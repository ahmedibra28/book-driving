'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
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
  CardFooter,
  Card,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Profile = () => {
  const [fileLink, setFileLink] = React.useState<string[]>([])

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
    url: `profile`,
  })?.put

  const FormSchema = z
    .object({
      name: z.string(),
      address: z.string(),
      mobile: z.number(),
      bio: z.string(),
      password: z.string().refine((val) => val.length === 0 || val.length > 6, {
        message: "Password can't be less than 6 characters",
      }),
      confirmPassword: z
        .string()
        .refine((val) => val.length === 0 || val.length > 6, {
          message: "Confirm password can't be less than 6 characters",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password do not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      address: '',
      mobile: 0,
      bio: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    updateApi?.mutateAsync({
      ...values,
      id: getApi?.data?.id,
      image: fileLink ? fileLink[0] : getApi?.data?.image,
    })
  }

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      const { name, mobile, email, image } = updateApi?.data
      updateUserInfo({
        ...userInfo,
        name,
        mobile,
        email,
        image,
      })
      setFileLink([])
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  useEffect(() => {
    form.setValue('name', !getApi?.isPending ? getApi?.data?.name : '')
    form.setValue('address', !getApi?.isPending ? getApi?.data?.address : '')
    form.setValue('mobile', !getApi?.isPending ? getApi?.data?.mobile : '')
    form.setValue('bio', !getApi?.isPending ? getApi?.data?.bio : '')
    setFileLink(!getApi?.isPending ? [getApi?.data?.image] : [])
    // eslint-disable-next-line
  }, [getApi?.isPending, form.setValue])

  const profile = getApi?.data

  return (
    <div className='max-w-6xl mx-auto bg-whites p-3 mt-2'>
      {updateApi?.isError && <Message value={updateApi?.error} />}

      {getApi?.isError && <Message value={getApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}

      {getApi?.isPending && <Spinner />}

      <div className='bg-opacity-60 max-w-4xl mx-auto'>
        <Card className='w-full mx-w-3xl lg:max-w-5xl mx-auto'>
          {userInfo.role === 'INSTRUCTOR' &&
            profile?.instructor?.status === 'PENDING' && (
              <CardHeader className='flex flex-row justify-between items-center'>
                <div>
                  <CardTitle>Complete your account</CardTitle>
                  <CardDescription>
                    Please fill out the form to complete your account.
                  </CardDescription>
                </div>

                <Avatar>
                  <AvatarImage src={getApi?.data?.image} />
                  <AvatarFallback>
                    {userInfo?.name?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
            )}

          <CardContent className='space-y-6 py-5'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {userInfo.role === 'INSTRUCTOR' &&
                  profile?.instructor?.status === 'PENDING' && (
                    <div>
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
                          step='0'
                        />
                        <CustomFormField
                          form={form}
                          name='email'
                          label='Email'
                          placeholder='Enter email'
                          type='text'
                          disabled={true}
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

                      <CardTitle className='text-lg'>
                        Driving Instructor Details
                      </CardTitle>
                      <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-y-1 gap-x-4'>
                        <CustomFormField
                          form={form}
                          name='drivingLicenseNo'
                          label='License No'
                          placeholder='Enter license no'
                          type='text'
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
                          name='yearsOfExperience'
                          label='Year of experience'
                          placeholder='Enter year of experience'
                          type='text'
                        />
                        <CustomFormField
                          form={form}
                          name='vehicleRegistrationNo'
                          label='Vehicle Registration No'
                          placeholder='Enter vehicle registration no'
                          type='text'
                        />
                        <CustomFormField
                          form={form}
                          name='vehicleModel'
                          label='Make and Model of Vehicle'
                          placeholder='Enter vehicle model'
                          type='text'
                        />
                      </div>

                      <CardTitle className='text-lg'>
                        Upload Documents
                      </CardTitle>
                      <CardDescription>
                        Please upload the following documents:
                      </CardDescription>
                      <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 my-4 gap-y-3 gap-x-4 text-gray-700'>
                        <Upload
                          label='Driving License'
                          setFileLink={setFileLink}
                          fileLink={fileLink}
                          fileType='image'
                        />
                        <Upload
                          label='Vehicle Registration'
                          setFileLink={setFileLink}
                          fileLink={fileLink}
                          fileType='image'
                        />
                        <Upload
                          label='Proof of Insurance'
                          setFileLink={setFileLink}
                          fileLink={fileLink}
                          fileType='image'
                        />
                        <Upload
                          label='CRP/DBS Check Certificate'
                          setFileLink={setFileLink}
                          fileLink={fileLink}
                          fileType='image'
                        />
                      </div>
                      <CustomFormField
                        form={form}
                        name='termAndCondition'
                        label='Terms and Conditions'
                        type='text'
                        fieldType='checkbox'
                      />
                      <CardDescription className='mb-5'>
                        By submitting this form, I confirm that all the I agree
                        to abide by the rules and regulations set forth by book
                        driving Ltd and understand that any misrepresentation
                        may lead to the termination of my registration.
                      </CardDescription>
                    </div>
                  )}

                {profile?.instructor?.status === 'APPROVED' ||
                  (userInfo.role !== 'INSTRUCTOR' && (
                    <div>
                      <CardTitle className='text-lg'>
                        Profile Information
                      </CardTitle>
                      <div className='flex flex-row flex-wrap gap-2 my-5'>
                        <div className='w-full md:w-[48%] lg:w-[32%]'>
                          <CustomFormField
                            form={form}
                            name='name'
                            label='Name'
                            placeholder='Enter name'
                            type='text'
                          />
                        </div>
                        <div className='w-full md:w-[48%] lg:w-[32%]'>
                          <CustomFormField
                            form={form}
                            name='address'
                            label='Address'
                            placeholder='Enter address'
                            type='text'
                          />
                        </div>

                        <div className='w-full md:w-[48%] lg:w-[32%]'>
                          <CustomFormField
                            form={form}
                            name='mobile'
                            label='Mobile'
                            placeholder='Enter mobile'
                            type='number'
                            step='0.01'
                          />
                        </div>
                        <div className='w-full md:w-[48%] lg:w-[32%]'>
                          <CustomFormField
                            form={form}
                            name='bio'
                            label='Bio'
                            placeholder='Tell us about yourself'
                            type='text'
                            cols={30}
                            rows={5}
                          />
                        </div>

                        <div className='w-full md:w-[48%] lg:w-[32%]'>
                          <Upload
                            label='Image'
                            setFileLink={setFileLink}
                            fileLink={fileLink}
                            fileType='image'
                          />

                          {fileLink.length > 0 && (
                            <div className='avatar text-center flex justify-center items-end mt-2'>
                              <div className='w-12 mask mask-squircle'>
                                <Image
                                  src={fileLink?.[0]}
                                  alt='avatar'
                                  width={50}
                                  height={50}
                                  style={{ objectFit: 'cover' }}
                                  className='rounded-full'
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className='flex justify-start flex-wrap flex-row w-full gap-2'>
                          <div className='w-full'>
                            <hr className='my-5' />
                            <CardTitle className='text-lg'>
                              Change Password
                            </CardTitle>
                            <CardDescription>
                              NB: Leave blank if you don&apos;t want to change
                            </CardDescription>
                          </div>
                          <div className='w-full md:w-[48%] lg:w-[32%]'>
                            <CustomFormField
                              form={form}
                              name='password'
                              label='Password'
                              placeholder="Leave blank if you don't want to change"
                              type='password'
                            />
                          </div>
                          <div className='w-full md:w-[48%] lg:w-[32%]'>
                            <CustomFormField
                              form={form}
                              name='confirmPassword'
                              label='Confirm Password'
                              placeholder='Confirm Password'
                              type='password'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                <div className='w-full md:w-[48%] lg:w-[32%] pt-3'>
                  <FormButton
                    loading={updateApi?.isPending}
                    label='Update Profile'
                    className='w-full'
                  />
                </div>
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
