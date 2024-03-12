'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@uidotdev/usehooks'

export default function Page() {
  const { width, height } = useWindowSize()

  return (
    <div className='container flex flex-col justify-center h-[70vh]'>
      <Confetti width={Number(width) - 20} height={height!} />
      <Card className='lg:w-1/2 mx-auto'>
        <CardHeader className='text-center text-green-500'>
          <CardTitle>Congratulations on booking your course!</CardTitle>
        </CardHeader>

        <CardContent className='space-y-2'>
          <CardDescription>
            Your booking has been confirmed, and we&apos;re thrilled to have you
            as our valued student.
          </CardDescription>
          <CardDescription>
            Our team will be in touch with you shortly to provide all the
            necessary details for your upcoming lessons with your dedicated
            driving instructor.
          </CardDescription>
          <CardDescription>
            Get ready to embark on an exciting journey towards becoming a
            skilled driver. We&apos;re here to support you every step of the
            way.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className='mx-auto'>
            <hr className='my-4 border-0.5 border-green-500' />
            <CardDescription>
              Thanks for choosing us, and we can&apos;t wait to see you behind
              the wheel!
            </CardDescription>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
