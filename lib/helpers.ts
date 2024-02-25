import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { S3Client } from '@aws-sdk/client-s3'

export function getEnvVariable(key: string): string {
  const value = process.env[key]

  if (!value || value.length === 0) {
    console.log(`The environment variable ${key} is not set.`)
    throw new Error(`The environment variable ${key} is not set.`)
  }

  return value
}

export function getErrorResponse(
  error: string | null = null,
  status: number = 500
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? 'fail' : 'error',
      error: error ? error : null,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

export async function matchPassword({
  enteredPassword,
  password,
}: {
  enteredPassword: string
  password: string
}) {
  return await bcrypt.compare(enteredPassword, password)
}

export async function encryptPassword({ password }: { password: string }) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export async function getResetPasswordToken(minute = 10) {
  const resetToken = crypto.randomBytes(20).toString('hex')

  return {
    resetToken,
    resetPasswordToken: crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex'),
    resetPasswordExpire: Date.now() + minute * (60 * 1000), // Ten Minutes
  }
}

export async function generateToken(id: string) {
  const JWT_SECRET = getEnvVariable('JWT_SECRET')
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d',
  })
}

export const s3Client = new S3Client({
  endpoint: getEnvVariable('AWS_DO_ENDPOINT'),
  forcePathStyle: true,
  region: 'us-east-1',
  credentials: {
    accessKeyId: getEnvVariable('AWS_DO_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_DO_ACCESS_KEY'),
  } as {
    accessKeyId: string
    secretAccessKey: string
  },
})

export const PreviousDrivingExperience = [
  {
    label: 'I HAVE NO EXPERIENCE AT ALL AND I AM NOT CONFIDENT',
    value: 'I_HAVE_NO_EXPERIENCE_AT_ALL_AND_I_AM_NOT_CONFIDENT',
  },
  {
    label: 'I HAVE NO EXPERIENCE AT ALL AND I AM CONFIDENT',
    value: 'I_HAVE_NO_EXPERIENCE_AT_ALL_AND_I_AM_CONFIDENT',
  },
  {
    label: 'I HAVE COMPLETED 1 - 10 HOURS OF LESSONS',
    value: 'I_HAVE_COMPLETED_1_TO_10_HOURS_OF_LESSONS',
  },
  {
    label: 'I HAVE COMPLETED 11 - 20 HOURS OF LESSONS',
    value: 'I_HAVE_COMPLETED_11_TO_20_HOURS_OF_LESSONS',
  },
  {
    label: 'I HAVE COMPLETED 21 - 30 HOURS OF LESSONS',
    value: 'I_HAVE_COMPLETED_21_TO_30_HOURS_OF_LESSONS',
  },
  {
    label: 'I HAVE COMPLETED 31 - 40 HOURS OF LESSONS',
    value: 'I_HAVE_COMPLETED_31_TO_40_HOURS_OF_LESSONS',
  },
  {
    label: 'I HAVE COMPLETED 41 OR MORE HOURS OF LESSONS',
    value: 'I_HAVE_COMPLETED_41_OR_MORE_HOURS_OF_LESSONS',
  },
]

export const DrivingExperience = [
  {
    label: 'I CAN DRIVE OR I HAVE BEEN IN FOR A DRIVING TEST',
    value: 'I_CAN_DRIVE_OR_I_HAVE_BEEN_IN_FOR_A_DRIVING_TEST',
  },
  {
    label: 'I HAVE HAD 30 OR MORE DRIVING LESSONS',
    value: 'I_HAVE_HAD_30_OR_MORE_DRIVING_LESSONS',
  },
  {
    label: 'I HAVE HAD 20 - 25 DRIVING LESSONS',
    value: 'I_HAVE_HAD_20_TO_25_DRIVING_LESSONS',
  },
  {
    label: 'I HAVE HAD 15 - 19 DRIVING LESSONS',
    value: 'I_HAVE_HAD_15_TO_19_DRIVING_LESSONS',
  },
  {
    label: 'I HAVE HAD 10 - 14 DRIVING LESSONS',
    value: 'I_HAVE_HAD_10_TO_14_DRIVING_LESSONS',
  },
  {
    label: 'I HAVE HAD 1 - 9 DRIVING LESSONS',
    value: 'I_HAVE_HAD_1_TO_9_DRIVING_LESSONS',
  },
  {
    label: 'I HAVE HAD NO LESSONS AND I AM CONFIDENT',
    value: 'I_HAVE_HAD_NO_LESSONS_AND_I_AM_CONFIDENT',
  },
  {
    label: 'I HAVE HAD NO LESSONS AND I AM NOT CONFIDENT',
    value: 'I_HAVE_HAD_NO_LESSONS_AND_I_AM_NOT_CONFIDENT',
  },
]

export const LessonPreferences = [
  { label: 'FLEXIBLE', value: 'FLEXIBLE' },
  { label: 'WEEKDAY MORNINGS', value: 'WEEKDAY_MORNINGS' },
  { label: 'WEEKDAY AFTERNOONS', value: 'WEEKDAY_AFTERNOONS' },
  { label: 'WEEKDAY EVENINGS', value: 'WEEKDAY_EVENINGS' },
  { label: 'WEEKENDS', value: 'WEEKENDS' },
]

export const ReferredFrom = [
  { label: ' GOOGLE', value: 'GOOGLE' },
  { label: 'FACEBOOK', value: 'FACEBOOK' },
  { label: 'INSTAGRAM', value: 'INSTAGRAM' },
  { label: 'RECOMMENDATION', value: 'RECOMMENDATION' },
  { label: 'OTHER', value: 'OTHER' },
]
