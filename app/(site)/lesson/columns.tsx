import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
}

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    { header: 'Lesson', accessorKey: 'lessonType', active: true },
    { header: 'Transmission', accessorKey: 'transmissionType', active: true },
    {
      header: 'Ultimate Theory Package',
      accessorKey: 'ultimateTheoryPackage',
      active: false,
    },
    {
      header: 'Fast Tracked Theory Test',
      accessorKey: 'fastTrackedTheoryTest',
      active: false,
    },
    {
      header: 'Fast Tracked Drive Test',
      accessorKey: 'fastTrackedDriveTest',
      active: false,
    },
    {
      header: 'Lesson Preferences',
      accessorKey: 'lessonPreferences',
      active: false,
    },
    {
      header: 'Previous Driving Experience',
      accessorKey: 'previousDrivingExperience',
      active: false,
    },
    { header: 'Deposit', accessorKey: 'deposit', active: false },
    {
      header: 'Instructor Price',
      accessorKey: 'instructorPrice',
      active: true,
    },
    { header: 'Description', accessorKey: 'description', active: false },
    {
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.status === 'ACTIVE' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : (
          original?.status === 'INACTIVE' && (
            <span className='text-red-500'>{original?.status}</span>
          )
        ),
    },
    {
      header: 'CreatedAt',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => (
        <ActionButton
          editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ]
}
