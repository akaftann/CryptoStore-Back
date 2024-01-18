'use strict'

import { v4 as uuidV4 } from 'uuid'
import * as config from '../config.js'

import * as db from '../db.js'
import * as helpers from '../lib/helpers.js'


export const create = async (typeName, originalTransactionId, data) => {
  const row = {
    id: uuidV4(),
    createdAt: helpers.timestamp(),
    typeName: typeName || '',
    originalTransactionId: originalTransactionId || '',
    data,
  }

  if (typeof data === 'object') {
    row.data = JSON.stringify(row.data)
  }

  await db.applePaymentEvents.insert(row, {ttl: config.APPLE_PAYMENT_EVENTS_TABLE_TTL}, {isIdempotent: true})
  return row
}
