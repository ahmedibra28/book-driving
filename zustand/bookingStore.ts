import { create } from 'zustand'

export type Booking = {
  readonly id?: string
  postalCode?: string
  mobile?: number | string
  lessonType?: string
  transmissionType?: string
  fastTrackedTheoryTest?: boolean
  fastTrackedDriveTest?: boolean
  lessonPreferences?: string[]
}

type BookingStore = {
  booking: Booking
  setBooking: (booking: Booking) => void
  step: number
  setStep: (step: number) => void
}

const useBookingStore = create<BookingStore>((set) => ({
  booking: {
    postalCode: '',
    mobile: '',
    lessonType: '',
    transmissionType: '',
    fastTrackedTheoryTest: false,
    fastTrackedDriveTest: false,
    lessonPreferences: [],
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
}))

export default useBookingStore
