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
      description,
    } = await req.json()

    const lessonObj = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        description: true,
      },
    })

    if (!lessonObj) return getErrorResponse('Lesson not found', 404)

    await prisma.$transaction(async (prisma) => {
      await prisma.description.deleteMany({
        where: { id: { in: lessonObj.description.map((lesson) => lesson.id) } },
      })

      await prisma.lesson.update({
        where: { id: params.id },
        data: {
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
          description: {
            create: description,
          },
        },
      })
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

    const lessonObj = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        description: true,
      },
    })

    if (!lessonObj) return getErrorResponse('Lesson not removed', 404)

    await prisma.$transaction(async (prisma) => {
      await prisma.description.deleteMany({
        where: { id: { in: lessonObj.description.map((lesson) => lesson.id) } },
      })
      const lesson = await prisma.lesson.delete({
        where: { id: params.id },
      })

      if (!lesson) return getErrorResponse('Lesson not removed', 404)
    })

    return NextResponse.json({
      ...lessonObj,
      message: 'Lesson has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
