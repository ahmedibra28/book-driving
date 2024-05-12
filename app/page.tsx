'use client'

import Header from '@/components/Header'
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
      const status = getApi?.data?.instructor?.status
      if (
        !['APPROVED', 'PENDING'].includes(status) &&
        userInfo.role === 'INSTRUCTOR'
      ) {
        router.push('/account/profile/complete')
      }
    }
    // eslint-disable-next-line
  }, [getApi?.isSuccess, userInfo.id])

  return (
    <div className='max-w-7xls mx-auto'>
      <Header />
    </div>
  )
}
