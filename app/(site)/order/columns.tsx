import DateTime from '@/lib/dateTime'
import Link from 'next/link'

export const columns = () => {
  return [
    {
      header: 'Full Name',
      accessorKey: 'fullName',
      active: true,
      cell: ({ row: { original } }: any) => (
        <Link className='underline' href={`/instructors/${original?.id}`}>
          {original?.fullName}
        </Link>
      ),
    },
    { header: 'Email', accessorKey: 'email', active: true },
    { header: 'Mobile', accessorKey: 'contactNo', active: true },
    { header: 'Postal Code', accessorKey: 'postalCode', active: true },
    { header: 'License No', accessorKey: 'drivingLicenseNo', active: true },
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
