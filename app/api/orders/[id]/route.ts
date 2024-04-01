import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { handleEmailFire } from '@/lib/email-helper'
import { WordCapitalize } from '@/lib/capitalize'
import Notification from '@/emails/Notification'
import { render } from '@react-email/render'
import { InstructorCourseOfferNotification } from '@/components/NotificationEmail'

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

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { instructors } = (await req.json()) as {
      instructors: { email: string }[]
    }

    if (instructors.length === 0)
      return getErrorResponse('Instructors not found', 404)

    const order = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        lesson: true,
        student: true,
      },
    })

    if (!order) return getErrorResponse('Order not found', 404)

    // send instructor emails
    await handleEmailFire({
      to: instructors?.map((item) => item.email).join(','),
      subject: `${WordCapitalize(
        order?.lesson?.lessonType
      )} Course Booking Notification`,
      html: render(
        Notification({
          company: 'Book Driving',
          message: InstructorCourseOfferNotification({
            link: `/account/profile/complete`,
            company: 'Book Driving',
          }),
          recipient: `Dear Instructor,`,
        })
      ),
    })

    await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status: 'EMAIL_SENT',
      },
    })

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch ({ status = 500, message }: any) {
    console.log({ message, status })
    return getErrorResponse(message, status)
  }
}
