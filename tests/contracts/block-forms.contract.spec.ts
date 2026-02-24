import { describe, it, beforeEach } from 'vitest';
import { createMockTransport, type MockTransport, type RecordedRequest } from '@23blocks/testing';
import { createFormsBlock, type FormsBlock } from '@23blocks/block-forms';
import {
  assertCorrectMethod,
  assertCorrectPath,
  assertCorrectRootKey,
  assertNoInventedFields,
  assertSnakeCaseFields,
  assertNoPatchRequests,
} from './helpers/contract-validator';
import {
  singleResponse,
  listResponse,
  plainResponse,
  batchResponse,
  matchResponse,
  sendOtpResponse,
  summaryResponse,
  crmStatusResponse,
} from './helpers/mock-response-factory';
import contract from './fixtures/block-forms.contract.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FORM_ID = 'form-abc-123';
const INSTANCE_ID = 'inst-xyz-789';
const SCHEMA_ID = 'schema-def-456';
const VERSION_ID = 'ver-ghi-012';
const URL_ID = 'magic-link-url';

type Endpoint = {
  operation: string;
  method: string;
  path: string;
  rootKey?: string | null;
  fields?: string[];
  action?: boolean;
};

function getEndpoints(service: string): Endpoint[] {
  return (contract.services as Record<string, { endpoints: Endpoint[] }>)[service].endpoints;
}

function findEndpoint(service: string, operation: string): Endpoint {
  const ep = getEndpoints(service).find((e) => e.operation === operation);
  if (!ep) throw new Error(`Endpoint ${service}.${operation} not found in contract`);
  return ep;
}

function getLastRequest(mock: MockTransport): RecordedRequest {
  const req = mock.getLastRequest();
  if (!req) throw new Error('No request recorded');
  return req;
}

function runBodyAssertions(
  request: RecordedRequest,
  endpoint: Endpoint,
  label: string
) {
  assertCorrectMethod(request, endpoint.method, label);
  assertCorrectPath(request, endpoint.path, label);
  if (endpoint.rootKey !== undefined) {
    assertCorrectRootKey(request, endpoint.rootKey, label);
  }
  if (endpoint.fields) {
    assertNoInventedFields(request, endpoint.fields, endpoint.rootKey ?? null, label);
  }
  assertSnakeCaseFields(request, endpoint.rootKey ?? null, label);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('block-forms contract tests', () => {
  let mock: MockTransport;
  let block: FormsBlock;

  beforeEach(() => {
    mock = createMockTransport({ throwOnUnmatched: false });
    // Register permissive handlers for all request types
    mock.onAny(/.*/).reply(200, singleResponse());
    block = createFormsBlock(mock, { apiKey: 'test-key' });
  });

  // =========================================================================
  // forms service
  // =========================================================================
  describe('forms', () => {
    it('list → GET /forms', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, listResponse());
      await block.forms.list();
      const req = getLastRequest(mock);
      const ep = findEndpoint('forms', 'list');
      assertCorrectMethod(req, ep.method, 'forms.list');
      assertCorrectPath(req, ep.path, 'forms.list');
    });

    it('get → GET /forms/:uniqueId', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.forms.get(FORM_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('forms', 'get');
      assertCorrectMethod(req, ep.method, 'forms.get');
      assertCorrectPath(req, ep.path, 'forms.get');
    });

    it('create → POST /forms with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.forms.create({
        code: 'test',
        name: 'Test Form',
        description: 'desc',
        formType: 'contact',
        formUrl: 'https://example.com',
        formDomain: 'example.com',
        formFields: { field1: 'text' },
        onlyOnce: false,
        backgroundUrl: 'https://bg.png',
        contentUrl: 'https://content.html',
        successUrl: 'https://success',
        errorUrl: 'https://error',
        notifySlack: true,
        successNotificationMessage: 'ok',
        errorNotificationMessage: 'fail',
        sendConfirmationMail: true,
        mailTemplate: 'tpl-1',
        sendConfirmationSms: false,
        smsTemplate: 'sms-1',
        sendAdminNotification: true,
        adminNotificationEmail: 'admin@test.com',
        adminNotificationTemplate: 'admin-tpl',
        formSchemaUniqueId: SCHEMA_ID,
        requireOtpVerification: false,
        payload: { extra: 'data' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('forms', 'create');
      runBodyAssertions(req, ep, 'forms.create');
    });

    it('update → PUT /forms/:uniqueId with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.forms.update(FORM_ID, {
        name: 'Updated',
        description: 'new desc',
        formType: 'survey',
        status: 'active',
        formUrl: 'https://updated.com',
        formDomain: 'updated.com',
        formFields: { field2: 'number' },
        onlyOnce: true,
        backgroundUrl: 'https://new-bg.png',
        contentUrl: 'https://new-content.html',
        successUrl: 'https://new-success',
        errorUrl: 'https://new-error',
        notifySlack: false,
        successNotificationMessage: 'updated ok',
        errorNotificationMessage: 'updated fail',
        sendConfirmationMail: false,
        mailTemplate: 'tpl-2',
        sendConfirmationSms: true,
        smsTemplate: 'sms-2',
        sendAdminNotification: false,
        adminNotificationEmail: 'new-admin@test.com',
        adminNotificationTemplate: 'new-admin-tpl',
        formSchemaUniqueId: SCHEMA_ID,
        requireOtpVerification: true,
        payload: { more: 'data' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('forms', 'update');
      runBodyAssertions(req, ep, 'forms.update');
    });

    it('delete → DELETE /forms/:uniqueId', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, {});
      await block.forms.delete(FORM_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('forms', 'delete');
      assertCorrectMethod(req, ep.method, 'forms.delete');
      assertCorrectPath(req, ep.path, 'forms.delete');
    });
  });

  // =========================================================================
  // landings service
  // =========================================================================
  describe('landings', () => {
    it('list → GET /landings/:formUniqueId/instances', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, listResponse());
      await block.landings.list(FORM_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('landings', 'list');
      assertCorrectMethod(req, ep.method, 'landings.list');
      assertCorrectPath(req, ep.path, 'landings.list');
    });

    it('submit → POST with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.landings.submit(FORM_ID, {
        email: 'test@test.com',
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        phoneNumber: '555-1234',
        message: 'Hello',
        notes: 'note',
        selectedOption: 'A',
        formFields: { q1: 'answer' },
        source: 'web',
        sourceAlias: 'homepage',
        sourceId: 'src-1',
        sourceType: 'organic',
        visitorUniqueId: 'vis-1',
        visitorType: 'new',
        touchId: 'touch-1',
        touchReferenceId: 'ref-1',
        preferredLanguage: 'en',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('landings', 'submit');
      runBodyAssertions(req, ep, 'landings.submit');
    });

    it('update → PUT with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.landings.update(FORM_ID, INSTANCE_ID, {
        email: 'updated@test.com',
        firstName: 'Jane',
        middleName: 'N',
        lastName: 'Smith',
        phoneNumber: '555-5678',
        message: 'Updated',
        notes: 'updated note',
        selectedOption: 'B',
        formFields: { q1: 'new answer' },
        source: 'api',
        sourceAlias: 'sdk',
        sourceId: 'src-2',
        sourceType: 'referral',
        visitorUniqueId: 'vis-2',
        visitorType: 'returning',
        touchId: 'touch-2',
        touchReferenceId: 'ref-2',
        preferredLanguage: 'es',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('landings', 'update');
      runBodyAssertions(req, ep, 'landings.update');
    });

    it('delete → DELETE /landings/:formUniqueId/instances/:uniqueId', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, {});
      await block.landings.delete(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('landings', 'delete');
      assertCorrectMethod(req, ep.method, 'landings.delete');
      assertCorrectPath(req, ep.path, 'landings.delete');
    });
  });

  // =========================================================================
  // subscriptions service
  // =========================================================================
  describe('subscriptions', () => {
    it('submit → POST with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.subscriptions.submit(FORM_ID, {
        email: 'sub@test.com',
        firstName: 'Sub',
        middleName: 'M',
        lastName: 'User',
        phoneNumber: '555-0000',
        notes: 'subscribed',
        selectedOption: 'newsletter',
        formFields: { pref: 'weekly' },
        source: 'web',
        sourceAlias: 'footer',
        sourceId: 'src-3',
        sourceType: 'organic',
        visitorUniqueId: 'vis-3',
        visitorType: 'new',
        touchId: 'touch-3',
        touchReferenceId: 'ref-3',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('subscriptions', 'submit');
      runBodyAssertions(req, ep, 'subscriptions.submit');
    });

    it('update → PUT with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.subscriptions.update(FORM_ID, INSTANCE_ID, {
        email: 'updated-sub@test.com',
        status: 'inactive',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('subscriptions', 'update');
      runBodyAssertions(req, ep, 'subscriptions.update');
    });
  });

  // =========================================================================
  // appointments service
  // =========================================================================
  describe('appointments', () => {
    it('create → POST with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.appointments.create(FORM_ID, {
        email: 'appt@test.com',
        firstName: 'App',
        middleName: 'T',
        lastName: 'User',
        phoneNumber: '555-1111',
        selectedOption: 'morning',
        formFields: { preference: 'in-person' },
        startAt: '2025-01-01T09:00:00Z',
        endAt: '2025-01-01T10:00:00Z',
        duration: 60,
        locationUniqueId: 'loc-1',
        locationName: 'Main Office',
        locationAddress: '123 Main St',
        assignedToUniqueId: 'user-1',
        assignedToName: 'Dr. Smith',
        assignedToEmail: 'dr@test.com',
        assignedToPhone: '555-2222',
        notes: 'first visit',
        source: 'web',
        sourceAlias: 'booking-page',
        sourceId: 'src-4',
        sourceType: 'direct',
        visitorUniqueId: 'vis-4',
        visitorType: 'patient',
        touchId: 'touch-4',
        touchReferenceId: 'ref-4',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'create');
      runBodyAssertions(req, ep, 'appointments.create');
    });

    it('update → PUT with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.appointments.update(FORM_ID, INSTANCE_ID, {
        email: 'updated-appt@test.com',
        startAt: '2025-02-01T09:00:00Z',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'update');
      runBodyAssertions(req, ep, 'appointments.update');
    });

    it('confirm → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.appointments.confirm(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'confirm');
      assertCorrectMethod(req, ep.method, 'appointments.confirm');
      assertCorrectPath(req, ep.path, 'appointments.confirm');
    });

    it('cancel → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.appointments.cancel(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'cancel');
      assertCorrectMethod(req, ep.method, 'appointments.cancel');
      assertCorrectPath(req, ep.path, 'appointments.cancel');
    });

    it('reportList → POST with query_params root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, listResponse());
      await block.appointments.reportList({
        formUniqueId: FORM_ID,
        userUniqueId: 'user-1',
        source: 'web',
        datePart: 'month',
        fromDate: '2025-01-01',
        toDate: '2025-12-31',
        status: 'active',
        page: 1,
        records: 10,
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'reportList');
      runBodyAssertions(req, ep, 'appointments.reportList');
    });

    it('reportSummary → POST with query_params root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, summaryResponse());
      await block.appointments.reportSummary({
        formUniqueId: FORM_ID,
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('appointments', 'reportSummary');
      runBodyAssertions(req, ep, 'appointments.reportSummary');
    });
  });

  // =========================================================================
  // surveys service
  // =========================================================================
  describe('surveys', () => {
    it('create → POST with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.surveys.create(FORM_ID, {
        email: 'survey@test.com',
        firstName: 'Survey',
        middleName: 'M',
        lastName: 'User',
        phoneNumber: '555-3333',
        message: 'survey response',
        notes: 'important',
        selectedOption: 'option-1',
        formFields: { nps: 9 },
        source: 'email',
        sourceAlias: 'campaign-1',
        sourceId: 'src-5',
        sourceType: 'email',
        visitorUniqueId: 'vis-5',
        visitorType: 'customer',
        touchId: 'touch-5',
        touchReferenceId: 'ref-5',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('surveys', 'create');
      runBodyAssertions(req, ep, 'surveys.create');
    });

    it('update → PUT with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.surveys.update(FORM_ID, INSTANCE_ID, {
        email: 'updated-survey@test.com',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('surveys', 'update');
      runBodyAssertions(req, ep, 'surveys.update');
    });

    it('updateStatus → PUT with survey root key containing status', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.surveys.updateStatus(FORM_ID, INSTANCE_ID, { status: 'completed' });
      const req = getLastRequest(mock);
      const ep = findEndpoint('surveys', 'updateStatus');
      runBodyAssertions(req, ep, 'surveys.updateStatus');
    });

    it('resendMagicLink → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, {});
      await block.surveys.resendMagicLink(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('surveys', 'resendMagicLink');
      assertCorrectMethod(req, ep.method, 'surveys.resendMagicLink');
      assertCorrectPath(req, ep.path, 'surveys.resendMagicLink');
    });

    it('listByUser → POST /surveys/users/ with user_unique_id field', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, listResponse());
      await block.surveys.listByUser('user-abc');
      const req = getLastRequest(mock);
      const ep = findEndpoint('surveys', 'listByUser');
      assertCorrectMethod(req, ep.method, 'surveys.listByUser');
      assertCorrectPath(req, ep.path, 'surveys.listByUser');
      // listByUser sends fields at top level (rootKey: null)
      assertSnakeCaseFields(req, null, 'surveys.listByUser');
    });
  });

  // =========================================================================
  // referrals service
  // =========================================================================
  describe('referrals', () => {
    it('create → POST with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.referrals.create(FORM_ID, {
        firstName: 'Ref',
        middleName: 'M',
        lastName: 'User',
        email: 'ref@test.com',
        phoneNumber: '555-4444',
        message: 'referral msg',
        notes: 'referred',
        selectedOption: 'plan-a',
        formFields: { code: 'REF123' },
        referredByType: 'customer',
        referredByName: 'John Doe',
        referredByUniqueId: 'user-ref-1',
        source: 'web',
        sourceAlias: 'referral-page',
        sourceId: 'src-6',
        sourceType: 'referral',
        visitorUniqueId: 'vis-6',
        visitorType: 'new',
        touchId: 'touch-6',
        touchReferenceId: 'ref-6',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('referrals', 'create');
      runBodyAssertions(req, ep, 'referrals.create');
    });

    it('update → PUT with correct root key and fields', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.referrals.update(FORM_ID, INSTANCE_ID, {
        email: 'updated-ref@test.com',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('referrals', 'update');
      runBodyAssertions(req, ep, 'referrals.update');
    });
  });

  // =========================================================================
  // formInstances service
  // =========================================================================
  describe('formInstances', () => {
    it('create → POST with app_form_instance root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.instances.create(FORM_ID, {
        assignedToUniqueId: 'user-1',
        assignedToEmail: 'user@test.com',
        assignedToName: 'Test User',
        assignedByName: 'Admin',
        expiresAt: '2025-12-31T23:59:59Z',
        responses: [{ q1: 'answer' }],
        metadata: { tag: 'important' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'create');
      runBodyAssertions(req, ep, 'formInstances.create');
    });

    it('update → PUT with app_form_instance root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.instances.update(FORM_ID, INSTANCE_ID, {
        assignedToUniqueId: 'user-2',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'update');
      runBodyAssertions(req, ep, 'formInstances.update');
    });

    it('start → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.instances.start(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'start');
      assertCorrectMethod(req, ep.method, 'formInstances.start');
      assertCorrectPath(req, ep.path, 'formInstances.start');
    });

    it('submit → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.instances.submit(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'submit');
      assertCorrectMethod(req, ep.method, 'formInstances.submit');
      assertCorrectPath(req, ep.path, 'formInstances.submit');
    });

    it('cancel → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.instances.cancel(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'cancel');
      assertCorrectMethod(req, ep.method, 'formInstances.cancel');
      assertCorrectPath(req, ep.path, 'formInstances.cancel');
    });

    it('resendMagicLink → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, {});
      await block.instances.resendMagicLink(FORM_ID, INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('formInstances', 'resendMagicLink');
      assertCorrectMethod(req, ep.method, 'formInstances.resendMagicLink');
      assertCorrectPath(req, ep.path, 'formInstances.resendMagicLink');
    });
  });

  // =========================================================================
  // formSchemas service
  // =========================================================================
  describe('formSchemas', () => {
    it('create → POST with form_schema root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.schemas.create(FORM_ID, {
        formUniqueId: FORM_ID,
        name: 'Test Schema',
        description: 'A test schema',
        formFields: { field1: { type: 'text' } },
        datasource: { type: 'manual' },
        payload: { version: 1 },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSchemas', 'create');
      runBodyAssertions(req, ep, 'formSchemas.create');
    });

    it('update → PUT with form_schema root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.schemas.update(FORM_ID, SCHEMA_ID, {
        name: 'Updated Schema',
        description: 'Updated',
        formFields: { field2: { type: 'number' } },
        datasource: { type: 'api' },
        enabled: true,
        status: 'active',
        payload: { version: 2 },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSchemas', 'update');
      runBodyAssertions(req, ep, 'formSchemas.update');
    });
  });

  // =========================================================================
  // formSchemaVersions service
  // =========================================================================
  describe('formSchemaVersions', () => {
    it('create → POST with form_schema_version root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.schemaVersions.create(FORM_ID, SCHEMA_ID, {
        formFields: { field1: { type: 'text', required: true } },
        datasource: { type: 'manual' },
        payload: { v: 1 },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSchemaVersions', 'create');
      runBodyAssertions(req, ep, 'formSchemaVersions.create');
    });

    it('update → PUT with form_schema_version root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.schemaVersions.update(FORM_ID, SCHEMA_ID, VERSION_ID, {
        formFields: { field1: { type: 'text', required: false } },
        datasource: { type: 'api' },
        status: 'active',
        payload: { v: 2 },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSchemaVersions', 'update');
      runBodyAssertions(req, ep, 'formSchemaVersions.update');
    });

    it('publish → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.schemaVersions.publish(FORM_ID, SCHEMA_ID, VERSION_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSchemaVersions', 'publish');
      assertCorrectMethod(req, ep.method, 'formSchemaVersions.publish');
      assertCorrectPath(req, ep.path, 'formSchemaVersions.publish');
    });
  });

  // =========================================================================
  // formSets service
  // =========================================================================
  describe('formSets', () => {
    it('create → POST with form_set root key (including nested items)', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.sets.create({
        code: 'intake',
        name: 'Intake Set',
        description: 'Initial intake forms',
        category: 'onboarding',
        appliesTo: 'new_patient',
        isActive: true,
        isDefault: false,
        sendAllAtOnce: false,
        allowPartialCompletion: true,
        enforceSequential: true,
        expirationDays: 30,
        autoAssignRules: { trigger: 'registration' },
        metadata: { priority: 'high' },
        formSetItemsAttributes: [
          { formSchemaUniqueId: SCHEMA_ID, displayOrder: 1, required: true },
        ],
        payload: { extra: 'data' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSets', 'create');
      runBodyAssertions(req, ep, 'formSets.create');
    });

    it('update → PUT with form_set root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.sets.update(INSTANCE_ID, {
        name: 'Updated Set',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSets', 'update');
      runBodyAssertions(req, ep, 'formSets.update');
    });

    it('match → POST with context root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, matchResponse());
      await block.sets.match({
        userUniqueId: 'user-1',
        formSetUniqueId: 'set-1',
        category: 'onboarding',
        appliesTo: 'new_patient',
        metadata: { tag: 'test' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSets', 'match');
      runBodyAssertions(req, ep, 'formSets.match');
    });

    it('autoAssign → POST with assignment root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, listResponse());
      await block.sets.autoAssign({
        userUniqueId: 'user-1',
        formSetUniqueId: 'set-1',
        assignedByName: 'Admin',
        expiresAt: '2025-12-31T00:00:00Z',
        metadata: { source: 'auto' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('formSets', 'autoAssign');
      runBodyAssertions(req, ep, 'formSets.autoAssign');
    });
  });

  // =========================================================================
  // mailTemplates service
  // =========================================================================
  describe('mailTemplates', () => {
    it('create → POST with template root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.mailTemplates.create({
        name: 'Welcome Email',
        eventName: 'user_signup',
        fromSubject: 'Welcome!',
        templateHtml: '<h1>Hi</h1>',
        templateText: 'Hi',
        templateName: 'welcome-tpl',
        fromAddress: 'noreply@test.com',
        fromDomain: 'test.com',
        fromName: 'Test App',
        provider: 'mandrill',
        source: 'web',
        sourceAlias: 'signup',
        sourceId: 'src-7',
        sourceType: 'system',
        preferredLanguage: 'en',
        key: 'mandrill-key',
        secret: 'mandrill-secret',
        payload: { version: '1.0' },
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('mailTemplates', 'create');
      runBodyAssertions(req, ep, 'mailTemplates.create');
    });

    it('update → PUT with template root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.mailTemplates.update(INSTANCE_ID, {
        name: 'Updated Welcome',
        status: 'active',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('mailTemplates', 'update');
      runBodyAssertions(req, ep, 'mailTemplates.update');
    });

    it('getStats → GET /mailtemplates/:uniqueId/stats', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, { sent: 100, delivered: 98 });
      await block.mailTemplates.getStats(INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('mailTemplates', 'getStats');
      assertCorrectMethod(req, ep.method, 'mailTemplates.getStats');
      assertCorrectPath(req, ep.path, 'mailTemplates.getStats');
    });
  });

  // =========================================================================
  // applicationForms service
  // =========================================================================
  describe('applicationForms', () => {
    it('get → GET /:urlId/forms/public', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.applicationForms.get(URL_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('applicationForms', 'get');
      assertCorrectMethod(req, ep.method, 'applicationForms.get');
      assertCorrectPath(req, ep.path, 'applicationForms.get');
    });

    it('submit → POST with responses field (no root key)', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.applicationForms.submit(URL_ID, { data: { q1: 'answer1' } });
      const req = getLastRequest(mock);
      const ep = findEndpoint('applicationForms', 'submit');
      assertCorrectMethod(req, ep.method, 'applicationForms.submit');
      assertCorrectPath(req, ep.path, 'applicationForms.submit');
      assertSnakeCaseFields(req, null, 'applicationForms.submit');
      assertNoInventedFields(req, ep.fields!, null, 'applicationForms.submit');
    });

    it('draft → PUT with responses field (no root key)', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.applicationForms.draft(URL_ID, { data: { q1: 'draft' } });
      const req = getLastRequest(mock);
      const ep = findEndpoint('applicationForms', 'draft');
      assertCorrectMethod(req, ep.method, 'applicationForms.draft');
      assertCorrectPath(req, ep.path, 'applicationForms.draft');
      assertSnakeCaseFields(req, null, 'applicationForms.draft');
      assertNoInventedFields(req, ep.fields!, null, 'applicationForms.draft');
    });

    it('sendOtp → POST action with empty body', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, sendOtpResponse());
      await block.applicationForms.sendOtp(URL_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('applicationForms', 'sendOtp');
      assertCorrectMethod(req, ep.method, 'applicationForms.sendOtp');
      assertCorrectPath(req, ep.path, 'applicationForms.sendOtp');
    });

    it('verifyOtp → POST with code field (no root key)', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());
      await block.applicationForms.verifyOtp(URL_ID, { code: '123456' });
      const req = getLastRequest(mock);
      const ep = findEndpoint('applicationForms', 'verifyOtp');
      assertCorrectMethod(req, ep.method, 'applicationForms.verifyOtp');
      assertCorrectPath(req, ep.path, 'applicationForms.verifyOtp');
      assertSnakeCaseFields(req, null, 'applicationForms.verifyOtp');
      assertNoInventedFields(req, ep.fields!, null, 'applicationForms.verifyOtp');
    });
  });

  // =========================================================================
  // crmSync service
  // =========================================================================
  describe('crmSync', () => {
    it('syncLanding → POST action', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, plainResponse());
      await block.crmSync.syncLanding(INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'syncLanding');
      assertCorrectMethod(req, ep.method, 'crmSync.syncLanding');
      assertCorrectPath(req, ep.path, 'crmSync.syncLanding');
    });

    it('syncSubscription → POST action', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, plainResponse());
      await block.crmSync.syncSubscription(INSTANCE_ID);
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'syncSubscription');
      assertCorrectMethod(req, ep.method, 'crmSync.syncSubscription');
      assertCorrectPath(req, ep.path, 'crmSync.syncSubscription');
    });

    it('syncAppointment → POST with optional as_type field', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, plainResponse());
      await block.crmSync.syncAppointment(INSTANCE_ID, 'lead');
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'syncAppointment');
      assertCorrectMethod(req, ep.method, 'crmSync.syncAppointment');
      assertCorrectPath(req, ep.path, 'crmSync.syncAppointment');
      assertSnakeCaseFields(req, null, 'crmSync.syncAppointment');
      assertNoInventedFields(req, ep.fields!, null, 'crmSync.syncAppointment');
    });

    it('batchSync → POST with batch root key', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, batchResponse());
      await block.crmSync.batchSync({
        limit: 100,
        syncLandings: true,
        syncSubscriptions: true,
        syncAppointments: false,
        appointmentsAsType: 'contact',
      });
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'batchSync');
      runBodyAssertions(req, ep, 'crmSync.batchSync');
    });

    it('retryFailed → POST with optional limit field', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, batchResponse());
      await block.crmSync.retryFailed(50);
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'retryFailed');
      assertCorrectMethod(req, ep.method, 'crmSync.retryFailed');
      assertCorrectPath(req, ep.path, 'crmSync.retryFailed');
      assertSnakeCaseFields(req, null, 'crmSync.retryFailed');
      assertNoInventedFields(req, ep.fields!, null, 'crmSync.retryFailed');
    });

    it('testConnection → GET /crm/test_connection', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, crmStatusResponse());
      await block.crmSync.testConnection();
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'testConnection');
      assertCorrectMethod(req, ep.method, 'crmSync.testConnection');
      assertCorrectPath(req, ep.path, 'crmSync.testConnection');
    });

    it('status → GET /crm/status', async () => {
      mock.resetAll();
      mock.onAny(/.*/).reply(200, crmStatusResponse());
      await block.crmSync.status();
      const req = getLastRequest(mock);
      const ep = findEndpoint('crmSync', 'status');
      assertCorrectMethod(req, ep.method, 'crmSync.status');
      assertCorrectPath(req, ep.path, 'crmSync.status');
    });
  });

  // =========================================================================
  // Global: zero PATCH requests
  // =========================================================================
  describe('global rules', () => {
    it('no PATCH requests across all recorded history', async () => {
      // Run a representative set of operations to check PATCH never happens
      mock.resetAll();
      mock.onAny(/.*/).reply(200, singleResponse());

      await block.forms.create({ code: 'test', name: 'Test' });
      await block.forms.update(FORM_ID, { name: 'Updated' });
      await block.landings.submit(FORM_ID, { email: 'test@test.com' });
      await block.landings.update(FORM_ID, INSTANCE_ID, { email: 'new@test.com' });
      await block.subscriptions.submit(FORM_ID, { email: 'sub@test.com' });
      await block.subscriptions.update(FORM_ID, INSTANCE_ID, { email: 'new-sub@test.com' });
      await block.instances.create(FORM_ID, { assignedToName: 'Test' });
      await block.instances.update(FORM_ID, INSTANCE_ID, { assignedToName: 'Updated' });
      await block.schemas.create(FORM_ID, { formUniqueId: FORM_ID, name: 'Schema' });
      await block.schemas.update(FORM_ID, SCHEMA_ID, { name: 'Updated Schema' });

      assertNoPatchRequests(mock.history.all);
    });
  });
});
