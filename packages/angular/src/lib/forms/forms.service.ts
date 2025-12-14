import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createFormsBlock,
  type FormsBlock,
  type FormsBlockConfig,
  type Form,
  type CreateFormRequest,
  type UpdateFormRequest,
  type ListFormsParams,
  type FormSchema,
  type CreateFormSchemaRequest,
  type UpdateFormSchemaRequest,
  type ListFormSchemasParams,
  type FormInstance,
  type CreateFormInstanceRequest,
  type UpdateFormInstanceRequest,
  type SubmitFormInstanceRequest,
  type ListFormInstancesParams,
  type FormSet,
  type CreateFormSetRequest,
  type UpdateFormSetRequest,
  type ListFormSetsParams,
} from '@23blocks/block-forms';
import { TRANSPORT, FORMS_TRANSPORT, FORMS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Forms block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class FormComponent {
 *   constructor(private formsService: FormsService) {}
 *
 *   loadForms() {
 *     this.formsService.listForms().subscribe({
 *       next: (result) => console.log('Forms:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FormsService {
  private readonly block: FormsBlock | null;

  constructor(
    @Optional() @Inject(FORMS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(FORMS_CONFIG) config: FormsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createFormsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): FormsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] FormsService is not configured. ' +
        "Add 'urls.forms' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Forms Service
  // ───────────────────────────────────────────────────────────────────────────

  listForms(params?: ListFormsParams): Observable<PageResult<Form>> {
    return from(this.ensureConfigured().forms.list(params));
  }

  getForm(uniqueId: string): Observable<Form> {
    return from(this.ensureConfigured().forms.get(uniqueId));
  }

  createForm(data: CreateFormRequest): Observable<Form> {
    return from(this.ensureConfigured().forms.create(data));
  }

  updateForm(uniqueId: string, data: UpdateFormRequest): Observable<Form> {
    return from(this.ensureConfigured().forms.update(uniqueId, data));
  }

  deleteForm(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().forms.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Schemas Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormSchemas(params?: ListFormSchemasParams): Observable<PageResult<FormSchema>> {
    return from(this.ensureConfigured().schemas.list(params));
  }

  getFormSchema(uniqueId: string): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.get(uniqueId));
  }

  createFormSchema(data: CreateFormSchemaRequest): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.create(data));
  }

  updateFormSchema(uniqueId: string, data: UpdateFormSchemaRequest): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.update(uniqueId, data));
  }

  deleteFormSchema(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().schemas.delete(uniqueId));
  }

  getLatestFormSchemaVersion(formUniqueId: string): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.getLatestVersion(formUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Instances Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormInstances(params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.list(params));
  }

  getFormInstance(uniqueId: string): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.get(uniqueId));
  }

  createFormInstance(data: CreateFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.create(data));
  }

  updateFormInstance(uniqueId: string, data: UpdateFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.update(uniqueId, data));
  }

  deleteFormInstance(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().instances.delete(uniqueId));
  }

  submitFormInstance(data: SubmitFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.submit(data));
  }

  listFormInstancesByUser(userUniqueId: string, params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.listByUser(userUniqueId, params));
  }

  listFormInstancesBySchema(formSchemaUniqueId: string, params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.listBySchema(formSchemaUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Sets Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormSets(params?: ListFormSetsParams): Observable<PageResult<FormSet>> {
    return from(this.ensureConfigured().sets.list(params));
  }

  getFormSet(uniqueId: string): Observable<FormSet> {
    return from(this.ensureConfigured().sets.get(uniqueId));
  }

  createFormSet(data: CreateFormSetRequest): Observable<FormSet> {
    return from(this.ensureConfigured().sets.create(data));
  }

  updateFormSet(uniqueId: string, data: UpdateFormSetRequest): Observable<FormSet> {
    return from(this.ensureConfigured().sets.update(uniqueId, data));
  }

  deleteFormSet(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().sets.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): FormsBlock {
    return this.ensureConfigured();
  }
}
