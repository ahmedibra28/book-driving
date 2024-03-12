import { create } from 'zustand'
import type {
  LessonType,
  PreviousDrivingExperience,
  TransmissionType,
} from '@prisma/client'

export type Lesson = {
  id: string
  hours: number
  lessonType?: LessonType
  transmissionType?: TransmissionType
  ultimateTheoryPackage: boolean
  fastTrackedTheoryTest: boolean
  fastTrackedDriveTest: boolean
  lessonPreferences: string[]
  previousDrivingExperience?: PreviousDrivingExperience
  deposit: number
  instructorPrice: number
  descriptions: string[]
  createdAt: Date
}[]

type LessonStore = {
  lessons: Lesson
  setLesson: (lessons: Lesson) => void
  reset: () => void
}

const useLessonStore = create<LessonStore>((set) => ({
  lessons: [
    {
      id: '',
      hours: 0,
      lessonType: undefined,
      transmissionType: undefined,
      ultimateTheoryPackage: false,
      fastTrackedTheoryTest: false,
      fastTrackedDriveTest: false,
      lessonPreferences: [],
      previousDrivingExperience: undefined,
      deposit: 0,
      instructorPrice: 0,
      descriptions: [],
      createdAt: new Date(),
    },
  ],
  setLesson: (lessons) => {
    return set(() => ({
      lessons,
    }))
  },

  reset: () => {
    return set(() => ({
      lessons: [
        {
          id: '',
          hours: 0,
          lessonType: undefined,
          transmissionType: undefined,
          ultimateTheoryPackage: false,
          fastTrackedTheoryTest: false,
          fastTrackedDriveTest: false,
          lessonPreferences: [],
          previousDrivingExperience: undefined,
          deposit: 0,
          instructorPrice: 0,
          descriptions: [],
          createdAt: new Date(),
        },
      ],
    }))
  },
}))

export default useLessonStore
