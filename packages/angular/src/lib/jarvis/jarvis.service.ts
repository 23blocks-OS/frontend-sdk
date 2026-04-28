import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createJarvisBlock,
  type JarvisBlock,
  type JarvisBlockConfig,
} from '@23blocks/block-jarvis';
import { TRANSPORT, JARVIS_TRANSPORT, JARVIS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Jarvis block.
 *
 * Exposes block sub-services directly via typed getters (delegations CRUD, unread summary for conversations).
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const response = await this.jarvisService.agents.chat(agentId, { message });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class JarvisService {
  private readonly block: JarvisBlock | null;

  constructor(
    @Optional() @Inject(JARVIS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(JARVIS_CONFIG) config: JarvisBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createJarvisBlock(transport, config) : null;
  }

  private ensureConfigured(): JarvisBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] JarvisService is not configured. ' +
        "Add 'urls.jarvis' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get agents() { return this.ensureConfigured().agents; }
  get prompts() { return this.ensureConfigured().prompts; }
  get workflows() { return this.ensureConfigured().workflows; }
  get executions() { return this.ensureConfigured().executions; }
  get conversations() { return this.ensureConfigured().conversations; }
  get aiModels() { return this.ensureConfigured().aiModels; }
  get entities() { return this.ensureConfigured().entities; }
  get clusters() { return this.ensureConfigured().clusters; }
  get users() { return this.ensureConfigured().users; }
  get workflowParticipants() { return this.ensureConfigured().workflowParticipants; }
  get workflowSteps() { return this.ensureConfigured().workflowSteps; }
  get workflowInstances() { return this.ensureConfigured().workflowInstances; }
  get agentRuntime() { return this.ensureConfigured().agentRuntime; }
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  get marvinChat() { return this.ensureConfigured().marvinChat; }
  get promptComments() { return this.ensureConfigured().promptComments; }
  get executionComments() { return this.ensureConfigured().executionComments; }
  get tools() { return this.ensureConfigured().tools; }
  get agentTools() { return this.ensureConfigured().agentTools; }
  get agentToolAssignments() { return this.ensureConfigured().agentToolAssignments; }
  get conditions() { return this.ensureConfigured().conditions; }
  get stepTransitions() { return this.ensureConfigured().stepTransitions; }
  get analytics() { return this.ensureConfigured().analytics; }
  get promptTests() { return this.ensureConfigured().promptTests; }
  get promptTestEvaluations() { return this.ensureConfigured().promptTestEvaluations; }
  get agentTests() { return this.ensureConfigured().agentTests; }
  get promptTemplates() { return this.ensureConfigured().promptTemplates; }
  get companyKeys() { return this.ensureConfigured().companyKeys; }
  get llmProviders() { return this.ensureConfigured().llmProviders; }
  get delegations() { return this.ensureConfigured().delegations; }

  /** Full block access */
  get jarvisBlock(): JarvisBlock { return this.ensureConfigured(); }
}
