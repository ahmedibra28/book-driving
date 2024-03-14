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

    const order = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        lesson: true,
        student: true,
      },
    })

    return NextResponse.json(order)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
