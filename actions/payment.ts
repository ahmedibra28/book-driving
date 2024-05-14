'use server'

import { Client } from 'square'
import { randomUUID } from 'crypto'

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const { paymentsApi } = new Client({
  accessToken: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
  environment: 'sandbox',
})

export async function submitPayment({
  sourceId,
  amount,
}: {
  sourceId: string
  amount: number
}) {
  try {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId,
      amountMoney: {
        currency: 'GBP',
        amount,
      },
    })

    return result
  } catch (error) {
    console.log('error: ', error?.errors)
    throw error?.errors
  }
}
