import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Img,
  Tailwind,
} from '@react-email/components'
import * as React from 'react'

interface NotificationProps {
  company: string
  message: any
  recipient: string
}

export const Notification = ({
  company,
  message,
  recipient,
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
            {recipient}
          </Heading>

          {message}

          {/* <Container className='bg-orange-300 p-4 rounded-xl mb-3'>
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
          </Container> */}

          <Img
            height='32'
            src={`https://github.com/ahmedibra28.png`}
            width='32'
            alt={`${company}'s Logo`}
          />

          <Text className='text-gray-400 text-xs mt-3 mb-6'>
            Thanks,
            <br />
            <strong>{company}</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default Notification
