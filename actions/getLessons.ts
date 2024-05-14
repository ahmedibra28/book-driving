'use server'

import { prisma } from '@/lib/prisma.db'
import { Booking } from '@/zustand/bookingStore'
import type {
  LessonType as ILessonType,
  PreviousDrivingExperience as IPreviousDrivingExperience,
} from '@prisma/client'

export default async function getLessons(props: Booking) {
  if (!props?.lessonType || !props?.previousDrivingExperience) return []

  if (props?.status === 'all') {
    const lessons = await prisma.lesson.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        hours: true,
        lessonType: true,
        transmissionType: true,
        ultimateTheoryPackage: true,
        fastTrackedTheoryTest: true,
        fastTrackedDriveTest: true,
        lessonPreferences: true,
        previousDrivingExperience: true,
        deposit: true,
        instructorPrice: true,
        descriptions: true,
        createdAt: true,
      },
    })

    return lessons
  } else {
    const lessons = await prisma.lesson.findMany({
      where: {
        lessonType: props.lessonType as ILessonType,
        previousDrivingExperience:
          props.previousDrivingExperience as IPreviousDrivingExperience,
      },
      select: {
        id: true,
        hours: true,
        lessonType: true,
        transmissionType: true,
        ultimateTheoryPackage: true,
        fastTrackedTheoryTest: true,
        fastTrackedDriveTest: true,
        lessonPreferences: true,
        previousDrivingExperience: true,
        deposit: true,
        instructorPrice: true,
        descriptions: true,
        createdAt: true,
      },
    })

    return lessons
  }
}
