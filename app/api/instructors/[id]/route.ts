import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const instructor = await prisma.instructor.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            address: true,
            createdAt: true,
            id: true,
          },
        },
      },
    })

    return NextResponse.json(instructor)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { status, note } = await req.json()

    const instructorObj = await prisma.instructor.findUnique({
      where: { id: params.id },
    })

    if (!instructorObj) return getErrorResponse('Instructor not found', 404)

    await prisma.instructor.update({
      where: { id: params.id },
      data: {
        status,
        note,
      },
    })

    return NextResponse.json({
      ...instructorObj,
      message: 'Instructor has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
