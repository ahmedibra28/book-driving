'use server'

import { prisma } from '@/lib/prisma.db'
import { Booking } from '@/zustand/bookingStore'
import type {
  DrivingExperience as IDrivingExperience,
  ReferredFrom as IReferredForm,
} from '@prisma/client'

import { render } from '@react-email/render'
import { handleEmailFire } from '@/lib/email-helper'
import Notification from '@/emails/Notification'

import { NewCourseBookingNotification } from '@/components/NotificationEmail'
import { WordCapitalize } from '@/lib/capitalize'

export default async function bookLesson(props: Booking) {
  if (
    !props?.lessonType ||
    !props?.previousDrivingExperience ||
    !props?.lessonId ||
    !props?.fullName ||
    !props?.mobile ||
    !props?.address ||
    !props?.address2 ||
    !props?.town ||
    !props?.postalCode ||
    !props?.licenseNo ||
    !props?.email
  )
    throw new Error('Please provide all required fields')

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: props?.lessonId,
    },
  })

  if (!lesson) throw new Error('Lesson not found')

  const transaction = await prisma.$transaction(async (prisma) => {
    const student = await prisma.student.create({
      data: {
        fullName: props?.fullName!,
        contactNo: `${props?.mobile}`,
        email: props?.email!,
        address: props?.address!,
        address2: props?.address2!,
        town: props?.town!,
        postalCode: props?.postalCode?.toUpperCase()!,
        licenseNo: props?.licenseNo!,
      },
    })

    if (!student) throw new Error('Student information not created')

    const transaction = await prisma.transaction.create({
      data: {
        lessonId: props?.lessonId!,
        isPassedTheoryTest: props?.isPassedTheoryTest === 'true',
        ...(props?.passedTheoryDate && {
          passedTheoryDate: new Date(props?.passedTheoryDate),
        }),
        discountTest: props?.discountTest === 'true' ? 5 : 0,
        startDate: new Date(props?.startDate || ''),
        practicalTestDate: new Date(props?.practicalTestDate || ''),
        drivingExperience: props?.drivingExperience as IDrivingExperience,
        referredFrom: props?.referredFrom as IReferredForm,
        discountCode: props?.discountCode,
        amount: lesson.deposit,
        status: 'PENDING',
        studentId: student.id,
      },
    })

    if (!transaction) throw new Error('Transaction not created')

    return transaction
  })

  await handleEmailFire({
    to: props?.email,
    subject: `${WordCapitalize(props?.lessonType)} Course Booking Notification`,
    html: render(
      Notification({
        company: 'Book Driving',
        message: NewCourseBookingNotification({
          lessonName: WordCapitalize(props?.lessonType),
        }),
        recipient: `Dear ${props?.fullName},`,
      })
    ),
  })

  return transaction
}
