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
 * @example
 * ```typescript
 * const files = await this.filesService.storageFiles.list();
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
