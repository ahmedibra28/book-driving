import { create } from 'zustand'

export type Booking = {
  readonly id?: string
  postalCode?: string
  mobile?: number | string

  // Step 1
  lessonType?: string
  transmissionType?: string
  fastTrackedTheoryTest?: boolean
  fastTrackedDriveTest?: boolean
  ultimateTheoryPackage?: boolean
  lessonPreferences?: string[]
  previousDrivingExperience?: string

  lessonId?: string

  // Step 2
  isPassedTheoryTest?: string
  discountTest?: string
  passedTheoryDate?: string
  startDate?: Date
  practicalTestDate?: string
  drivingExperience?: string

  // Step 3
  referredFrom?: string
  discountCode?: string
  fullName?: string
  email?: string
  address?: string
  address2?: string
  town?: string
  licenseNo?: string

  status?: string
}

type BookingStore = {
  booking: Booking
  setBooking: (booking: Booking) => void
  step: number
  setStep: (step: number) => void
  reset: () => void
}

const useBookingStore = create<BookingStore>((set) => ({
  booking: {
    postalCode: '',
    mobile: '',

    // Step 1
    lessonType: '',
    transmissionType: '',
    fastTrackedTheoryTest: false,
    fastTrackedDriveTest: false,
    ultimateTheoryPackage: false,
    lessonPreferences: [],
    previousDrivingExperience: '',

    lessonId: '',

    // Step 2
    isPassedTheoryTest: '',
    discountTest: '',
    passedTheoryDate: '',
    startDate: new Date(),
    practicalTestDate: '',
    drivingExperience: '',

    // Step 3
    referredFrom: '',
    discountCode: '',
    fullName: '',
    email: '',
    address: '',
    address2: '',
    town: '',
    licenseNo: '',
  },
  step: 1,
  setBooking: (booking) => {
    return set((state) => ({
      booking: {
        ...state.booking,
        ...booking,
      },
    }))
  },
  setStep: (step) => {
    return set(() => ({
      step,
    }))
  },

  reset: () => {
    return set(() => ({
      step: 1,
      booking: {
        postalCode: '',
        mobile: '',

        // Step 1
        lessonType: '',
        transmissionType: '',
        fastTrackedTheoryTest: false,
        fastTrackedDriveTest: false,
        ultimateTheoryPackage: false,
        lessonPreferences: [],
        previousDrivingExperience: '',

        lessonId: '',

        // Step 2
        isPassedTheoryTest: '',
        discountTest: '',
        passedTheoryDate: '',
        startDate: new Date(),
        practicalTestDate: '',
        drivingExperience: '',

        // Step 3
        referredFrom: '',
        discountCode: '',
        fullName: '',
        email: '',
        address: '',
        address2: '',
        town: '',
        licenseNo: '',
      },
    }))
  },
}))

export default useBookingStore
