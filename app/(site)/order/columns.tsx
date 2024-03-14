import { FormatNumber } from '@/components/FormatNumber'
import DateTime from '@/lib/dateTime'
import Link from 'next/link'

export const columns = () => {
  return [
    {
      header: 'Full Name',
      accessorKey: 'fullName',
      active: true,
      cell: ({ row: { original } }: any) => (
        <Link className='underline' href={`/order/${original?.id}`}>
          {original?.student?.fullName}
        </Link>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      active: true,
      cell: ({ row: { original } }: any) => original?.student?.email,
    },
    {
      header: 'Mobile',
      accessorKey: 'contactNo',
      active: true,
      cell: ({ row: { original } }: any) => original?.student?.contactNo,
    },
    {
      header: 'Postal Code',
      accessorKey: 'postalCode',
      active: true,
      cell: ({ row: { original } }: any) => original?.student?.postalCode,
    },
    {
      header: 'Town',
      accessorKey: 'town',
      active: false,
      cell: ({ row: { original } }: any) => original?.student?.town,
    },
    {
      header: 'Lesson',
      accessorKey: 'lesson.lessonType',
      active: true,
      cell: ({ row: { original } }: any) => original?.lesson?.lessonType,
    },
    {
      header: 'Hours',
      accessorKey: 'lesson.hours',
      active: true,
      cell: ({ row: { original } }: any) => original?.lesson?.hours,
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.startDate).format('DD-MM-YYYY'),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber value={original?.amount} />
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.status === 'APPROVED' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : original?.status === 'PENDING' ? (
          <span className='text-blue-500'>{original?.status}</span>
        ) : (
          <span className='text-red-500'>{original?.status}</span>
        ),
    },
    {
      header: 'CreatedAt',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
  ]
}
