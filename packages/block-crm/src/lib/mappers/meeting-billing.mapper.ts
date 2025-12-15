import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { MeetingBilling } from '../types/meeting-billing';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const meetingBillingMapper: JsonApiMapper<MeetingBilling> = {
  type: 'meeting_billing',
  map(resource: JsonApiResource): MeetingBilling {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      meetingUniqueId: parseString(attrs['meeting_unique_id']) || '',
      participantUniqueId: parseString(attrs['participant_unique_id']),
      participantEmail: parseString(attrs['participant_email']),
      payerName: parseString(attrs['payer_name']),
      amount: parseOptionalNumber(attrs['amount']),
      currency: parseString(attrs['currency']),
      billingStatus: parseString(attrs['billing_status']),
      paidAt: parseDate(attrs['paid_at']),
      dueAt: parseDate(attrs['due_at']),
      notes: parseString(attrs['notes']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
