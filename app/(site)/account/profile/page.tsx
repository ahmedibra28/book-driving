'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'

const Profile = () => {
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
      image: z.array(z.string()).optional(),
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
      image: values?.image?.[0] || getApi?.data?.image,
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
      // setFileLink([])
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  useEffect(() => {
    form.setValue('name', !getApi?.isPending ? getApi?.data?.name : '')
    form.setValue('address', !getApi?.isPending ? getApi?.data?.address : '')
    form.setValue('mobile', !getApi?.isPending ? getApi?.data?.mobile : '')
    form.setValue('bio', !getApi?.isPending ? getApi?.data?.bio : '')
    form.setValue('image', !getApi?.isPending ? [getApi?.data?.image] : [])
    // eslint-disable-next-line
  }, [getApi?.isPending, form.setValue])

  return (
    <Card className='m-4 mx-auto max-w-4xl'>
      <CardContent className='p-6'>
        {updateApi?.isError && <Message value={updateApi?.error} />}

        {getApi?.isError && <Message value={getApi?.error} />}
        {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}

        {getApi?.isPending && <Spinner />}

        <div className='bg-opacity-60 max-w-4xl mx-auto'>
          <div className='text-3xl uppercase text-center'> {userInfo.name}</div>
          <div className='text-center mb-10'>
            <div className='bg-primary w-32 text-white rounded-full mx-auto'>
              <span> {userInfo.role}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {getApi?.data?.image && (
                <div className='avatar text-center flex justify-center'>
                  <div className='w-32'>
                    <Image
                      src={getApi?.data?.image}
                      alt='avatar'
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                      className='rounded-full'
                    />
                  </div>
                </div>
              )}

              <div className='flex flex-row flex-wrap gap-2'>
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
                    form={form}
                    fileType='image'
                    name='image'
                  />

                  {form.watch('image') && (
                    <div className='avatar text-center flex justify-center items-end mt-2'>
                      <div className='w-12 mask mask-squircle'>
                        <Image
                          src={form.watch('image')?.[0] || ''}
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

              <div className='w-full md:w-[48%] lg:w-[32%] pt-3'>
                <FormButton
                  loading={updateApi?.isPending}
                  label='Update Profile'
                  className='w-full'
                />
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})
