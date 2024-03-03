'use server'

import { prisma } from '@/lib/prisma.db'
import { Booking } from '@/zustand/bookingStore'
import type { LessonType as ILessonType } from '@prisma/client'

export default async function getLessons(props: Booking) {
  return await props
}
