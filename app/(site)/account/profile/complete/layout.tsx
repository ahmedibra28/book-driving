import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Complete Your Profile',
  }),
}

export default function CompleteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
