import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createFilesBlock,
  type FilesBlock,
  type FilesBlockConfig,
} from '@23blocks/block-files';
import { TRANSPORT, FILES_TRANSPORT, FILES_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Files block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * File mappers (UserFile / StorageFile / EntityFile) now read every
 * attribute on the type — including AI/RAG fields (schemaModel,
 * structuredContent, fileStructure, metadata, rawContent, content) that
 * were previously dropped. The fileSchemas service path is also corrected
 * from `/file_schemas/*` to `/schemas/*`.
 *
 * Upload flow reminder (userFiles, storageFiles, entityFiles):
 *   1. await sub.presignUpload(...)
 *   2. PUT bytes to the returned `presignedUrl`
 *   3. await sub.add(...) — the `name` field MUST equal `fileName` from step 1.
 *      The original human-readable filename goes in `originalName`. Mismatching
 *      `name` causes 404s on later downloads (the S3 key is UUID-based).
 *
 * Breaking changes for the files block:
 *  - `storageFiles` methods now require a `urlId` (company tenant identifier) as
 *    the first argument. Routes moved to `/storage/:url_id/files`.
 *  - `entityFiles` methods now require an `entityUniqueId` as the first argument.
 *    Routes moved to `/entities/:unique_id/files`. Added `presignUpload`,
 *    `multipartPresign`, `multipartComplete`, `associate`, `disassociate`,
 *    `listEntities`, `getEntity`, `registerEntity`.
 *  - `userFiles.presignUpload` / `multipartPresign` / `multipartComplete` now
 *    return JSON:API-shaped responses with `presignedUrl`, `signedUrl`,
 *    `publicUrl`, `fileName`, `fileId`, `expiresAt` fields.
 *
 * @example
 * ```typescript
 * const files = await this.filesService.storageFiles.list(companyUrlId);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FilesService {
  private readonly block: FilesBlock | null;

  constructor(
    @Optional() @Inject(FILES_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(FILES_CONFIG) config: FilesBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createFilesBlock(transport, config) : null;
  }

  private ensureConfigured(): FilesBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] FilesService is not configured. ' +
        "Add 'urls.files' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get storageFiles() { return this.ensureConfigured().storageFiles; }
  get entityFiles() { return this.ensureConfigured().entityFiles; }
  get fileSchemas() { return this.ensureConfigured().fileSchemas; }
  get userFiles() { return this.ensureConfigured().userFiles; }
  get fileCategories() { return this.ensureConfigured().fileCategories; }
  get fileTags() { return this.ensureConfigured().fileTags; }
  get delegations() { return this.ensureConfigured().delegations; }
  get fileAccess() { return this.ensureConfigured().fileAccess; }
  get fileAccessRequests() { return this.ensureConfigured().fileAccessRequests; }

  /** Full block access */
  get filesBlock(): FilesBlock { return this.ensureConfigured(); }
}
