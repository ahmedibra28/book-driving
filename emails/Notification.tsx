import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface NotificationProps {
  company: string
  token: string
  clientName: string
  osName: string
  ip: string
  baseUrl: string
}

export const Notification = ({
  company,
  token,
  clientName,
  osName,
  ip,
  baseUrl,
}: NotificationProps) => (
  <Tailwind
    config={{
      theme: {
        extend: {
          colors: {
            primary: 'green',
          },
        },
      },
    }}
  >
    <Html>
      <Head />
      <Preview>Hello Ahmed,</Preview>
      <Body className='bg-white'>
        <Container className='px-3 mx-auto font-sans'>
          <Heading className='text-2xl font-bold text-black my-7'>
            Hello Ahmed,
          </Heading>

          <Container className='bg-orange-300 p-4 rounded-xl mb-3'>
            <Text className='font-bold'>
              Subject: New Driving Course Booking
            </Text>
            <Text className='mb-4 text-gray-700'>
              A new course has been booked by John Doe for lessons starting July
              15. Click here to view booking details.
            </Text>
          </Container>

          <Container className='bg-orange-300 p-4 rounded-xl mb-3'>
            <Text className='font-bold'>Subject: Course Request</Text>
            <Text className='mb-4 text-gray-700'>
              You have a new course request from John Doe for lessons starting
              July 15. Click here to accept or decline.
            </Text>
          </Container>

          <Container className='bg-orange-300 p-4 rounded-xl mb-3'>
            <Text className='font-bold'>Subject: Course Request Response</Text>
            <Text className='mb-4 text-gray-700'>
              Instructor Jane Smith has accepted the booking for John Doe
              starting July 15.
            </Text>
          </Container>

          <Container className='bg-orange-300 p-4 rounded-xl mb-3'>
            <Text className='font-bold'>
              Subject: Driving Course Confirmation
            </Text>
            <Text className='mb-4 text-gray-700'>
              Congratulations, your booking for lessons with Jane Smith starting
              July 15 has been confirmed. Please contact Jane to arrange your
              first lesson.
            </Text>
          </Container>

          <Text className='text-gray-400 text-xs mt-3 mb-6'>
            If you’re having trouble with the button above, copy and paste the
            URL below into your web browser. <br />
            <a href={baseUrl + '/auth/verification/' + token}>
              {baseUrl}/auth/verification/{token}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default Notification
