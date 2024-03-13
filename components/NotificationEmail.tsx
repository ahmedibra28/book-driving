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
