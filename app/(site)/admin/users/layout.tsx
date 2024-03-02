import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Users',
  }),
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='container px-2 mx-auto'>{children}</div>
}
