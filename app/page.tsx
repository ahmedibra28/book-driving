'use client'
import FormContainer from '@/components/FormContainer'
import useApi from '@/hooks/useApi'
import useUserInfoStore from '@/zustand/userStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { userInfo } = useUserInfoStore((state) => state)
  const router = useRouter()

  const getApi = useApi({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get

  useEffect(() => {
    if (getApi?.isSuccess && userInfo?.id) {
      if (
        getApi?.data?.instructor?.status !== 'APPROVED' &&
        userInfo.role === 'INSTRUCTOR'
      ) {
        router.push('/account/profile/complete')
      }
    }
    // eslint-disable-next-line
  }, [getApi?.isSuccess, userInfo.id])

  return (
    <FormContainer title='Home'>
      <h1 className='text-gray-500 text-center'>
        Welcome to
        <a href='https://nextjs.org' target='_blank'>
          <strong> Next.JS 14 </strong>
        </a>
        book-driving
      </h1>
    </FormContainer>
  )
}
