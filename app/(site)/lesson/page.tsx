'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useFieldArray, useForm } from 'react-hook-form'
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
import CustomFormField, { MultiSelect } from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { columns } from './columns'
import useDataStore from '@/zustand/dataStore'
import { LessonPreferences, PreviousDrivingExperience } from '@/lib/enums'
import { Button } from '@/components/ui/button'
import { FaPlus, FaX } from 'react-icons/fa6'

const FormSchema = z.object({
  hours: z.string(),
  lessonType: z.string(),
  transmissionType: z.string(),
  ultimateTheoryPackage: z.boolean().optional(),
  fastTrackedTheoryTest: z.boolean().optional(),
  fastTrackedDriveTest: z.boolean().optional(),
  lessonPreferences: z.array(z.string()),
  previousDrivingExperience: z.string(),
  status: z.string(),
  deposit: z.string(),
  instructorPrice: z.string(),
  descriptions: z
    .array(
      z.object({
        file: z.any(),
        description: z.string().min(1, { message: 'Description is required' }),
      })
    )
    .nonempty({ message: 'Description is required' }),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [selectedLessonPreference, setSelectedLessonPreference] = useState<
    { label: string; value: string }[]
  >([])

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
    defaultValues: {
      hours: '',
      ultimateTheoryPackage: false,
      fastTrackedTheoryTest: false,
      fastTrackedDriveTest: false,
      previousDrivingExperience: '',
      transmissionType: '',
      lessonType: '',
      status: '',
      instructorPrice: '',
      deposit: '',
      descriptions: [
        {
          description: '',
        },
      ],
    },
  })

  // { fields, append, prepend, remove, swap, move, insert }
  const formArray = useFieldArray({
    name: 'descriptions',
    control: form.control,
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
    form.setValue('deposit', `${item?.deposit}`)
    form.setValue('instructorPrice', `${item?.instructorPrice}`)

    // console.log(item)
    const lessonsPref = item?.lessonPreferences?.map((item) => ({
      label: item,
      value: item,
    }))

    setSelectedLessonPreference(lessonsPref)

    form.setValue(
      'descriptions',
      // @ts-ignore
      item?.descriptions?.map((item) => ({ description: item }))
    )
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Lesson'
  const modal = 'lesson'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setSelectedLessonPreference([])
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const lessonTypes = [
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

  let multiLessonPreference = React.useMemo(() => {
    const onlyValues = selectedLessonPreference?.map((item) => item.value)

    const uniqueData = LessonPreferences?.filter(
      (item) => !onlyValues?.includes(item.value)
    )

    return uniqueData

    // eslint-disable-next-line
  }, [edit, LessonPreferences])

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <CustomFormField
          form={form}
          name='hours'
          label='Hours'
          placeholder='Hours'
          type='number'
        />
        <CustomFormField
          form={form}
          name='lessonType'
          label='Lesson Type'
          placeholder='Lesson Type'
          fieldType='command'
          data={lessonTypes}
        />
        <CustomFormField
          form={form}
          name='transmissionType'
          label='Transmission Type'
          placeholder='Transmission Type'
          fieldType='command'
          data={transmissionTypes}
        />
        <MultiSelect
          form={form}
          name='lessonPreferences'
          label='Lesson Preferences'
          data={multiLessonPreference}
          selected={selectedLessonPreference}
          setSelected={setSelectedLessonPreference}
          edit={edit}
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
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
      </div>

      <div className='border p-2 my-2 bg-gray-100 rounded'>
        {formArray.fields.map((field, index) => (
          <div
            key={field.id}
            className='flex justify-between items-center gap-x-2'
          >
            <div className='w-full'>
              <CustomFormField
                form={form}
                name={`descriptions.${index}.description`}
                // label={`#${index + 1} Description`}
                placeholder='Description'
                type='text'
              />
            </div>
            <Button
              type='button'
              variant='destructive'
              onClick={() => formArray.remove(index)}
              size='sm'
              className='size-9 mt-2s'
            >
              <FaX />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type='button'
        onClick={() => formArray.append({ description: '' })}
        className='gap-x-1'
        size='sm'
      >
        <FaPlus /> Append
      </Button>
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
        height='h-[80vh]'
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
