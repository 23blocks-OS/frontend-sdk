import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createFormsService,
  createFormSchemasService,
  createFormInstancesService,
  createFormSetsService,
  type FormsService,
  type FormSchemasService,
  type FormInstancesService,
  type FormSetsService,
} from './services';

export interface FormsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface FormsBlock {
  forms: FormsService;
  schemas: FormSchemasService;
  instances: FormInstancesService;
  sets: FormSetsService;
}

export function createFormsBlock(
  transport: Transport,
  config: FormsBlockConfig
): FormsBlock {
  return {
    forms: createFormsService(transport, config),
    schemas: createFormSchemasService(transport, config),
    instances: createFormInstancesService(transport, config),
    sets: createFormSetsService(transport, config),
  };
}

export const formsBlockMetadata: BlockMetadata = {
  name: 'forms',
  version: '0.1.0',
  description: 'Dynamic forms, schemas, submissions, and form management',
  resourceTypes: [
    'Form',
    'FormSchema',
    'FormInstance',
    'FormSet',
  ],
};
