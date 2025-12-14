import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createJarvisBlock,
  type JarvisBlock,
  type JarvisBlockConfig,
  type Agent,
  type CreateAgentRequest,
  type UpdateAgentRequest,
  type ListAgentsParams,
  type ChatRequest,
  type ChatResponse,
  type CompleteRequest,
  type CompleteResponse,
  type Prompt,
  type CreatePromptRequest,
  type UpdatePromptRequest,
  type ListPromptsParams,
  type ExecutePromptRequest,
  type ExecutePromptResponse,
  type TestPromptRequest,
  type TestPromptResponse,
  type Workflow,
  type CreateWorkflowRequest,
  type UpdateWorkflowRequest,
  type ListWorkflowsParams,
  type RunWorkflowRequest,
  type RunWorkflowResponse,
  type Execution,
  type ListExecutionsParams,
  type Conversation,
  type CreateConversationRequest,
  type SendMessageRequest,
  type SendMessageResponse,
  type ListConversationsParams,
} from '@23blocks/block-jarvis';
import { TRANSPORT, JARVIS_TRANSPORT, JARVIS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Jarvis block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class ChatComponent {
 *   constructor(private jarvis: JarvisService) {}
 *
 *   sendMessage(agentId: string, message: string) {
 *     this.jarvis.chat(agentId, { message }).subscribe({
 *       next: (response) => console.log('Response:', response.response),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
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

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): JarvisBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] JarvisService is not configured. ' +
        "Add 'urls.jarvis' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agents Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAgents(params?: ListAgentsParams): Observable<PageResult<Agent>> {
    return from(this.ensureConfigured().agents.list(params));
  }

  getAgent(uniqueId: string): Observable<Agent> {
    return from(this.ensureConfigured().agents.get(uniqueId));
  }

  createAgent(data: CreateAgentRequest): Observable<Agent> {
    return from(this.ensureConfigured().agents.create(data));
  }

  updateAgent(uniqueId: string, data: UpdateAgentRequest): Observable<Agent> {
    return from(this.ensureConfigured().agents.update(uniqueId, data));
  }

  deleteAgent(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().agents.delete(uniqueId));
  }

  chat(uniqueId: string, data: ChatRequest): Observable<ChatResponse> {
    return from(this.ensureConfigured().agents.chat(uniqueId, data));
  }

  complete(uniqueId: string, data: CompleteRequest): Observable<CompleteResponse> {
    return from(this.ensureConfigured().agents.complete(uniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Prompts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listPrompts(params?: ListPromptsParams): Observable<PageResult<Prompt>> {
    return from(this.ensureConfigured().prompts.list(params));
  }

  getPrompt(uniqueId: string): Observable<Prompt> {
    return from(this.ensureConfigured().prompts.get(uniqueId));
  }

  createPrompt(data: CreatePromptRequest): Observable<Prompt> {
    return from(this.ensureConfigured().prompts.create(data));
  }

  updatePrompt(uniqueId: string, data: UpdatePromptRequest): Observable<Prompt> {
    return from(this.ensureConfigured().prompts.update(uniqueId, data));
  }

  deletePrompt(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().prompts.delete(uniqueId));
  }

  executePrompt(uniqueId: string, data: ExecutePromptRequest): Observable<ExecutePromptResponse> {
    return from(this.ensureConfigured().prompts.execute(uniqueId, data));
  }

  testPrompt(data: TestPromptRequest): Observable<TestPromptResponse> {
    return from(this.ensureConfigured().prompts.test(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflows Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWorkflows(params?: ListWorkflowsParams): Observable<PageResult<Workflow>> {
    return from(this.ensureConfigured().workflows.list(params));
  }

  getWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.ensureConfigured().workflows.get(uniqueId));
  }

  createWorkflow(data: CreateWorkflowRequest): Observable<Workflow> {
    return from(this.ensureConfigured().workflows.create(data));
  }

  updateWorkflow(uniqueId: string, data: UpdateWorkflowRequest): Observable<Workflow> {
    return from(this.ensureConfigured().workflows.update(uniqueId, data));
  }

  deleteWorkflow(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().workflows.delete(uniqueId));
  }

  runWorkflow(uniqueId: string, data: RunWorkflowRequest): Observable<RunWorkflowResponse> {
    return from(this.ensureConfigured().workflows.run(uniqueId, data));
  }

  pauseWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.ensureConfigured().workflows.pause(uniqueId));
  }

  resumeWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.ensureConfigured().workflows.resume(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Executions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listExecutions(params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.ensureConfigured().executions.list(params));
  }

  getExecution(uniqueId: string): Observable<Execution> {
    return from(this.ensureConfigured().executions.get(uniqueId));
  }

  listExecutionsByAgent(agentUniqueId: string, params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.ensureConfigured().executions.listByAgent(agentUniqueId, params));
  }

  listExecutionsByPrompt(promptUniqueId: string, params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.ensureConfigured().executions.listByPrompt(promptUniqueId, params));
  }

  cancelExecution(uniqueId: string): Observable<Execution> {
    return from(this.ensureConfigured().executions.cancel(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Conversations Service
  // ─────────────────────────────────────────────────────────────────────────────

  listConversations(params?: ListConversationsParams): Observable<PageResult<Conversation>> {
    return from(this.ensureConfigured().conversations.list(params));
  }

  getConversation(uniqueId: string): Observable<Conversation> {
    return from(this.ensureConfigured().conversations.get(uniqueId));
  }

  createConversation(data: CreateConversationRequest): Observable<Conversation> {
    return from(this.ensureConfigured().conversations.create(data));
  }

  sendMessage(uniqueId: string, data: SendMessageRequest): Observable<SendMessageResponse> {
    return from(this.ensureConfigured().conversations.sendMessage(uniqueId, data));
  }

  listConversationsByUser(userUniqueId: string, params?: ListConversationsParams): Observable<PageResult<Conversation>> {
    return from(this.ensureConfigured().conversations.listByUser(userUniqueId, params));
  }

  clearConversation(uniqueId: string): Observable<Conversation> {
    return from(this.ensureConfigured().conversations.clear(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): JarvisBlock {
    return this.ensureConfigured();
  }
}
