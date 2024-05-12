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

export type SquarePaymentResponse = {
  id: string
  createdAt: string
  updatedAt: string
  amountMoney: {
    amount: string
    currency: string
  }
  totalMoney: {
    amount: string
    currency: string
  }
  approvedMoney: {
    amount: string
    currency: string
  }
  status: string
  delayDuration: string
  delayAction: string
  delayedUntil: string
  sourceType: string
  cardDetails: {
    status: string
    card: {
      cardBrand: string
      last4: string
      expMonth: string
      expYear: string
      fingerprint: string
      cardType: string
      prepaidType: string
      bin: string
    }
    entryMethod: string
    cvvStatus: string
    avsStatus: string
    statementDescription: string
    cardPaymentTimeline: {
      authorizedAt: string
      capturedAt: string
    }
  }
  locationId: string
  orderId: string
  riskEvaluation: {
    createdAt: string
    riskLevel: string
  }
  receiptNumber: string
  receiptUrl: string
  applicationDetails: {
    squareProduct: string
    applicationId: string
  }
  versionToken: string
}
