// Block factory and metadata
export { createFormsBlock, formsBlockMetadata } from './lib/forms.block';
export type { FormsBlock, FormsBlockConfig } from './lib/forms.block';

// Types
export type {
  // Form types
  Form,
  CreateFormRequest,
  UpdateFormRequest,
  ListFormsParams,
  // Form Schema types
  FormSchema,
  CreateFormSchemaRequest,
  UpdateFormSchemaRequest,
  ListFormSchemasParams,
  // Form Instance types
  FormInstance,
  CreateFormInstanceRequest,
  UpdateFormInstanceRequest,
  SubmitFormInstanceRequest,
  ListFormInstancesParams,
  // Form Set types
  FormSet,
  FormReference,
  CreateFormSetRequest,
  UpdateFormSetRequest,
  ListFormSetsParams,
} from './lib/types';

// Services
export type {
  FormsService,
  FormSchemasService,
  FormInstancesService,
  FormSetsService,
} from './lib/services';

export {
  createFormsService,
  createFormSchemasService,
  createFormInstancesService,
  createFormSetsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  formMapper,
  formSchemaMapper,
  formInstanceMapper,
  formSetMapper,
} from './lib/mappers';
