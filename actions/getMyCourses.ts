'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getMyCourses(instructorEmail: string) {
  if (!instructorEmail) return []

  const orders = await prisma.transaction.findMany({
    where: {
      status: {
        in: ['ACTIVE', 'EMAIL_SENT'],
      },
      invitations: {
        has: instructorEmail,
      },
    },
    include: {
      lesson: true,
      student: {
        select: {
          id: true,
          fullName: true,
          contactNo: true,
          email: true,
          postalCode: true,
          address: true,
          town: true,
        },
      },
    },
    take: 50,
  })

  return orders
}
