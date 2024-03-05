'use client'

import LessonCard from '@/components/ui/LessonCard'
import useLessonStore from '@/zustand/lessonStore'
import React from 'react'

export default function Page() {
  const { lessons } = useLessonStore((state) => state)

  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {lessons?.map((lesson) => (
          <LessonCard key={lesson.id} item={lesson} />
        ))}
      </div>
    </div>
  )
}
