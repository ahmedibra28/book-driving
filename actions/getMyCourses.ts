'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getMyCourses(instructorEmail: string) {
  if (!instructorEmail) return []

  const orders = await prisma.transaction.findMany({
    where: {
      status: 'EMAIL_SENT',
      invitations: {
        equals: [instructorEmail],
      },
    },
    include: {
      lesson: true,
    },
    take: 50,
  })

  return orders
}
