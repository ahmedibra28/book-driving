import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Lessons',
  }),
}

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
