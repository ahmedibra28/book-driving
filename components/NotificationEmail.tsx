import { Container, Text } from '@react-email/components'

export const NewCourseBookingNotification = ({
  lessonName,
}: {
  lessonName: string
}) => {
  return (
    <Container className='rounded-xl mb-3'>
      <Text className='mb-4 text-gray-700'>
        This email is to notify you that we have received your booking for the{' '}
        {lessonName} course.
      </Text>
      <Text className='mb-4 text-gray-700'>
        Within the next 1 business day, you will be assigned an instructor who
        will contact you directly to:
      </Text>

      <Text className='mb-4 text-gray-700'>
        <ul>
          <li key={1}>
            <Text className='text-gray-500 my-0'>
              Schedule your first lesson
            </Text>
          </li>
          <li key={2}>
            <Text className='text-gray-500 my-0'>
              Provide the course materials
            </Text>
          </li>
          <li key={3}>
            <Text className='text-gray-500 my-0'>
              Answer any initial questions
            </Text>
          </li>
          <li key={4}>
            <Text className='text-gray-500 my-0'>
              Help you get started with the course
            </Text>
          </li>
        </ul>
      </Text>
    </Container>
  )
}

export const InstructorCourseOfferNotification = ({
  link,
  company,
}: {
  link: string
  company: string
}) => {
  return (
    <Container className='rounded-xl mb-3'>
      <Text className='mb-4 text-gray-700'>
        We have an open driving course available and believe you would be a
        great fit as the instructor. If you&apos;re interested, please complete
        your instructor profile and indicate your availability using the link
        below:
      </Text>
      <a
        href={`http://localhost:3000` + link}
        target='_blank'
        className='bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer no-underline'
      >
        Click here to setup your profile
      </a>
      <Text className='mb-4 text-gray-700'>
        Once your profile is complete, we will provide you with the
        student&apos;s details. You can then connect with them and plan the
        lessons accordingly.
      </Text>
      <Text className='mb-4 text-gray-700'>
        We value your expertise and commitment to providing excellent
        instruction. Join us in shaping skilled and confident drivers.
      </Text>
      <Text className='text-gray-400 text-xs mt-3 mb-6'>
        Best regards,
        <br />
        <strong>{company}</strong>
      </Text>
    </Container>
  )
}
