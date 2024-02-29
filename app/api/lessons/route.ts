import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import type { LessonType as ILessonType } from '@prisma/client'
import { LessonPreferences } from '@/lib/enums'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    const query = q
      ? {
          lessonType: q.toUpperCase() as ILessonType,
        }
      : {}

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.lesson.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lesson.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

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
      descriptions,
    } = await req.json()

    lessonPreferences?.map((item: string) => {
      if (!LessonPreferences?.map((v) => v.value).includes(item)) {
        throw {
          message: 'Invalid lesson preferences',
          status: 400,
        }
      }
    })

    const lessonObj = await prisma.lesson.create({
      data: {
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
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...lessonObj,
      message: 'Lesson created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
