import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Notifications',
  }),
}

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
