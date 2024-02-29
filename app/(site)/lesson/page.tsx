'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { Lesson as ILesson } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { columns } from './columns'
import useDataStore from '@/zustand/dataStore'
import { LessonPreferences, PreviousDrivingExperience } from '@/lib/enums'

const FormSchema = z.object({
  lessonType: z.string(),
  transmissionType: z.string(),
  ultimateTheoryPackage: z.string(),
  fastTrackedTheoryTest: z.string(),
  fastTrackedDriveTest: z.string(),
  lessonPreferences: z.string(),
  previousDrivingExperience: z.string(),
  status: z.string(),
  deposit: z.string(),
  instructorPrice: z.string(),
  description: z.string().optional(),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = useApi({
    key: ['lessons'],
    method: 'GET',
    url: `lessons?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['lessons'],
    method: 'POST',
    url: `lessons`,
  })?.post

  const updateApi = useApi({
    key: ['lessons'],
    method: 'PUT',
    url: `lessons`,
  })?.put

  const deleteApi = useApi({
    key: ['lessons'],
    method: 'DELETE',
    url: `lessons`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: ILesson) => {
    setId(item.id!)
    setEdit(true)
    Object.keys(item)?.forEach((k) => {
      // @ts-ignore
      form.setValue(k, item?.[k])
    })
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Lesson'
  const modal = 'lesson'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const lessonPlans = [
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'INTENSIVELY', value: 'INTENSIVELY' },
  ]
  const transmissionTypes = [
    { label: 'MANUAL', value: 'MANUAL' },
    { label: 'AUTOMATIC', value: 'AUTOMATIC' },
  ]
  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <CustomFormField
          form={form}
          name='lessonPlan'
          label='Lesson Plan'
          placeholder='Lesson Plan'
          fieldType='command'
          data={lessonPlans}
        />
        <CustomFormField
          form={form}
          name='transmissionType'
          label='Transmission Type'
          placeholder='Transmission Type'
          fieldType='command'
          data={transmissionTypes}
        />
        <CustomFormField
          form={form}
          name='lessonPreference'
          label='Lesson Preference'
          placeholder='Lesson Preference'
          fieldType='command'
          data={LessonPreferences}
        />
        <CustomFormField
          form={form}
          name='previousDrivingExperience'
          label='Previous Driving Experience'
          placeholder='Previous Driving Experience'
          fieldType='command'
          data={PreviousDrivingExperience}
        />
        <CustomFormField
          form={form}
          name='status'
          label='Status'
          placeholder='Status'
          fieldType='command'
          data={status}
        />
        <CustomFormField
          form={form}
          name='deposit'
          label='Deposit'
          placeholder='Deposit'
          type='number'
        />
        <CustomFormField
          form={form}
          name='instructorPrice'
          label='Instructor Price'
          placeholder='Instructor Price'
          type='number'
        />
        <div className='hidden md:flex'></div>
        <CustomFormField
          form={form}
          name='ultimateTheoryPackage'
          label='Ultimate Theory Package'
          placeholder='Ultimate Theory Package'
          fieldType='checkbox'
        />
        <CustomFormField
          form={form}
          name='fastTrackedTheoryTest'
          label='Fast Tracked Theory Test'
          placeholder='Fast Tracked Theory Test'
          fieldType='checkbox'
        />
        <CustomFormField
          form={form}
          name='fastTrackedDriveTest'
          label='Fast Tracked Drive Test'
          placeholder='Fast Tracked Drive Test'
          fieldType='checkbox'
        />
        <div className='hidden md:flex'></div>
        <CustomFormField
          form={form}
          name='description'
          label='Description'
          placeholder='Description'
          cols={3}
          rows={3}
        />
      </div>
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        width='md:min-w-[600px]'
      />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Lessons List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })