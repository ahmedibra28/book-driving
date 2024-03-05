import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const {
      hours,
      lessonType,
      transmissionType,
      ultimateTheoryPackage,
      fastTrackedTheoryTest,
      fastTrackedDriveTest,
      lessonPreferences,
      previousDrivingExperience,
      status,
      deposit,
      instructorPrice,
      descriptions,
    } = await req.json()

    const lessonObj = await prisma.lesson.findUnique({
      where: { id: params.id },
    })

    if (!lessonObj) return getErrorResponse('Lesson not found', 404)

    await prisma.lesson.update({
      where: { id: params.id },
      data: {
        hours: parseInt(hours),
        lessonType,
        transmissionType,
        ultimateTheoryPackage,
        fastTrackedTheoryTest,
        fastTrackedDriveTest,
        lessonPreferences,
        previousDrivingExperience,
        status,
        deposit: parseInt(deposit),
        instructorPrice: parseInt(instructorPrice),
        descriptions: descriptions?.map(
          (item: { description: string }) => item.description
        ),
      },
    })

    return NextResponse.json({
      message: 'Lesson has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const lessonObj = await prisma.lesson.delete({
      where: { id: params.id },
    })

    if (!lessonObj) return getErrorResponse('Lesson not removed', 404)

    return NextResponse.json({
      ...lessonObj,
      message: 'Lesson has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
