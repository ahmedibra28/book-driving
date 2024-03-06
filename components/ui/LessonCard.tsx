import {
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  Card,
  CardHeader,
} from '@/components/ui/card'
import {
  FaCalendar,
  FaCarSide,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import { LucideJoystick } from 'lucide-react'
import { Lesson } from '@/zustand/lessonStore'
import { WordCapitalize } from '@/lib/capitalize'
import { FormatNumber } from '../FormatNumber'
import { FormButton } from './CustomForm'
import { useRouter } from 'next/navigation'

export default function LessonCard({ item }: { item: Lesson[0] }) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item?.hours || 40} Hours</CardTitle>
        <CardDescription>Driving Lesson Package</CardDescription>
        <CardDescription>
          {WordCapitalize(
            item?.previousDrivingExperience
              ?.replaceAll('I_HAVE_', ' ')
              ?.replaceAll('I_AM_', ' ')
              ?.replaceAll('_', ' ') || ''
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div className='flex items-center gap-4'>
          <FaCarSide className='size-5' />
          <div>
            <div className='text-base'>
              {WordCapitalize(item.lessonType as string)}
            </div>
            <p className='text-sm leading-none'>Lesson Type</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <LucideJoystick className='size-5' />
          <div>
            <div className='text-base'>
              {WordCapitalize(item.transmissionType as string)}
            </div>
            <p className='text-sm leading-none'>Transmission Type</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {item?.fastTrackedDriveTest ? (
            <FaCheckCircle className='size-5' />
          ) : (
            <FaTimesCircle className='size-5 text-red-500' />
          )}

          <div>
            <div className='text-base'>
              {item?.fastTrackedDriveTest ? 'Yes' : 'No'}
            </div>
            <p className='text-sm leading-none'>Test Booking Included</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='grid grid-cols-1 gap-y-2'>
        <div className='space-y-1'>
          {item?.descriptions?.map((item, index) => (
            <CardDescription key={index} className='flex gap-x-1 text-sm'>
              <FaCheckCircle className='size-5s mt-1' /> {item}
            </CardDescription>
          ))}
        </div>
        <div className='space-y-2 text-right'>
          <CardTitle className='text-2xl'>
            <FormatNumber
              value={
                Number(item?.instructorPrice || 0) + Number(item?.deposit || 0)
              }
            />
          </CardTitle>
          <CardDescription className='text-sm'>
            <span>
              Pay Instructor: <FormatNumber value={item?.instructorPrice} />
            </span>
            <br />
            <span>
              Deposit: <FormatNumber value={item?.deposit} />
            </span>
          </CardDescription>
          <p className='text-sm leading-none'>Schedule your driving lesson</p>
          <FormButton
            icon={<FaCalendar />}
            variant='outline'
            label='Book Lesson'
            onClick={() => router.push(`/booking/complete-details/${item?.id}`)}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
