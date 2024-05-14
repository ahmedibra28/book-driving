// types

export type MyCourseProp = {
  id: string
  isPassedTheoryTest: boolean
  passedTheoryDate: Date | null
  discountTest: number
  startDate: Date
  practicalTestDate: Date
  drivingExperience: string
  referredFrom: string
  discountCode: string | null
  amount: number
  status: string
  invitations: string[]
  studentId: string
  lessonId: string
  instructorId: any
  createdAt: Date
  lesson: {
    id: string
    hours: number
    lessonType: string
    transmissionType: string
    ultimateTheoryPackage: boolean
    fastTrackedTheoryTest: boolean
    fastTrackedDriveTest: boolean
    lessonPreferences: string[]
    previousDrivingExperience: string
    status: string
    deposit: number
    instructorPrice: number
    descriptions: string[]
    createdAt: Date
    createdById: string
  }
  student?: {
    id: string
    fullName: string
    contactNo: string
    email: string
    postalCode: string
    address: string
    town: string | null
  }
}
