'use server'

import { prisma } from '@/lib/prisma.db'

export default async function updateLessonStatus(
  id: string,
  status: string,
  email: string
) {
  if (!id) return []

  try {
    const order = await prisma.transaction.findUnique({
      where: {
        id,
        status: 'EMAIL_SENT',
        invitations: {
          has: email,
        },
      },
    })

    if (!order) throw new Error('Order not found')

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new Error('User not found')

    await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        ...(status === 'ACTIVE' && {
          status: 'ACTIVE',
          invitations: [email],
          instructorId: user.id,
        }),
        ...(status === 'INACTIVE' && {
          invitations: order.invitations.filter((item) => item !== email),
        }),
      },
    })

    return true
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
