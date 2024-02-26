import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { roles } from '@/config/data'
import type { InstructorStatus as IStatus } from '@prisma/client'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const {
      address,
      fullName,
      dateOfBirth,
      contactNo,
      street,
      city,
      postalCode,
      drivingLicenseNo,
      licenseExpiryDate,
      qualification,
      yearsOfExperience,
      specialization,
      vehicleRegistrationNo,
      vehicleModel,
      termAndCondition,
      drivingLicenseFile,
      vehicleRegistrationFile,
      proofOfInsuranceFile,
      dbsCertificateFile,
    } = await req.json()

    const roleId = roles.find((item) => item.type === 'INSTRUCTOR')?.id
    if (!roleId) return getErrorResponse('Role not found', 404)

    if (!termAndCondition)
      return getErrorResponse('Please accept the term and condition', 400)

    const object = await prisma.user.findUnique({
      where: {
        id: req.user.id,
        confirmed: true,
        blocked: false,
        roleId,
      },
    })

    if (!object)
      return getErrorResponse('User did not verified or not found', 404)

    const obj = {
      userId: req.user.id,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      contactNo,
      email: req.user.email,
      address,
      street,
      city,
      postalCode,
      drivingLicenseNo,
      licenseExpiryDate: new Date(licenseExpiryDate),
      qualification,
      yearsOfExperience: parseInt(yearsOfExperience),
      specialization,
      vehicleRegistrationNo,
      vehicleModel,
      drivingLicenseFile: drivingLicenseFile[0],
      vehicleRegistrationFile: vehicleRegistrationFile[0],
      proofOfInsuranceFile: proofOfInsuranceFile[0],
      dbsCertificateFile: dbsCertificateFile[0],
      termAndCondition,
      status: 'PENDING' as IStatus,
      note: '',
    }

    const result = await prisma.instructor.upsert({
      where: { userId: req.user.id },
      update: obj,
      create: obj,
    })

    if (!result)
      return getErrorResponse('Instructor details not completed', 400)

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        mobile: parseInt(contactNo),
        name: fullName,
        address,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${fullName
          ?.split(' ')[0]
          .toLowerCase()}&background=random&color=random&size=128`,
      },
    })

    return NextResponse.json({
      ...result,
      message: 'Profile has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
