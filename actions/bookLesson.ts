'use server'

import { prisma } from '@/lib/prisma.db'
import { Booking } from '@/zustand/bookingStore'
import type {
  DrivingExperience as IDrivingExperience,
  ReferredFrom as IReferredForm,
} from '@prisma/client'

// {
//   "postalCode": "BN02010",
//   "mobile": "6155555551",
//   "lessonType": "INTENSIVELY",
//   "transmissionType": "AUTOMATIC",
//   "fastTrackedTheoryTest": true,
//   "fastTrackedDriveTest": true,
//   "ultimateTheoryPackage": true,
//   "lessonPreferences": [
//       "WEEKDAY_MORNINGS"
//   ],
//   "previousDrivingExperience": "I_HAVE_COMPLETED_1_TO_10_HOURS_OF_LESSONS",
//   "lessonId": "APLpD__Nq4KKtDNYQ_cM1",
//   "isPassedTheoryTest": "false",
//   "discountTest": "false",
//   "passedTheoryDate": "",
//   "startDate": "2024-03-21",
//   "practicalTestDate": "2024-04-01",
//   "drivingExperience": "I_HAVE_HAD_15_TO_19_DRIVING_LESSONS",
//   "referredFrom": "FACEBOOK",
//   "discountCode": "123",
//   "fullName": "Ahmed Ibrahim Samow",
//   "contactNo": "615301507",
//   "email": "ahmaat19@gmail.com",
//   "address": "Makkah Almukaramah",
//   "licenseNo": "nn"
// }

export default async function bookLesson(props: Booking) {
  if (
    !props?.lessonType ||
    !props?.previousDrivingExperience ||
    !props?.lessonId ||
    !props?.contactNo ||
    !props?.fullName ||
    !props?.address ||
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
        contactNo: props?.contactNo!,
        email: props?.email!,
        address: props?.address!,
        licenseNo: props?.licenseNo!,
      },
    })

    if (!student) throw new Error('Student information not created')

    const transaction = await prisma.transaction.create({
      data: {
        lessonId: props?.lessonId!,
        isPassedTheoryTest: props?.isPassedTheoryTest === 'true',
        passedTheoryDate: new Date(props?.passedTheoryDate || ''),
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

  return transaction
}
