import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, JARVIS_CONFIG } from '../tokens.js';

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
  private readonly block: JarvisBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(JARVIS_CONFIG) config: JarvisBlockConfig
  ) {
    this.block = createJarvisBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agents Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAgents(params?: ListAgentsParams): Observable<PageResult<Agent>> {
    return from(this.block.agents.list(params));
  }

  getAgent(uniqueId: string): Observable<Agent> {
    return from(this.block.agents.get(uniqueId));
  }

  createAgent(data: CreateAgentRequest): Observable<Agent> {
    return from(this.block.agents.create(data));
  }

  updateAgent(uniqueId: string, data: UpdateAgentRequest): Observable<Agent> {
    return from(this.block.agents.update(uniqueId, data));
  }

  deleteAgent(uniqueId: string): Observable<void> {
    return from(this.block.agents.delete(uniqueId));
  }

  chat(uniqueId: string, data: ChatRequest): Observable<ChatResponse> {
    return from(this.block.agents.chat(uniqueId, data));
  }

  complete(uniqueId: string, data: CompleteRequest): Observable<CompleteResponse> {
    return from(this.block.agents.complete(uniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Prompts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listPrompts(params?: ListPromptsParams): Observable<PageResult<Prompt>> {
    return from(this.block.prompts.list(params));
  }

  getPrompt(uniqueId: string): Observable<Prompt> {
    return from(this.block.prompts.get(uniqueId));
  }

  createPrompt(data: CreatePromptRequest): Observable<Prompt> {
    return from(this.block.prompts.create(data));
  }

  updatePrompt(uniqueId: string, data: UpdatePromptRequest): Observable<Prompt> {
    return from(this.block.prompts.update(uniqueId, data));
  }

  deletePrompt(uniqueId: string): Observable<void> {
    return from(this.block.prompts.delete(uniqueId));
  }

  executePrompt(uniqueId: string, data: ExecutePromptRequest): Observable<ExecutePromptResponse> {
    return from(this.block.prompts.execute(uniqueId, data));
  }

  testPrompt(data: TestPromptRequest): Observable<TestPromptResponse> {
    return from(this.block.prompts.test(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflows Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWorkflows(params?: ListWorkflowsParams): Observable<PageResult<Workflow>> {
    return from(this.block.workflows.list(params));
  }

  getWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.block.workflows.get(uniqueId));
  }

  createWorkflow(data: CreateWorkflowRequest): Observable<Workflow> {
    return from(this.block.workflows.create(data));
  }

  updateWorkflow(uniqueId: string, data: UpdateWorkflowRequest): Observable<Workflow> {
    return from(this.block.workflows.update(uniqueId, data));
  }

  deleteWorkflow(uniqueId: string): Observable<void> {
    return from(this.block.workflows.delete(uniqueId));
  }

  runWorkflow(uniqueId: string, data: RunWorkflowRequest): Observable<RunWorkflowResponse> {
    return from(this.block.workflows.run(uniqueId, data));
  }

  pauseWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.block.workflows.pause(uniqueId));
  }

  resumeWorkflow(uniqueId: string): Observable<Workflow> {
    return from(this.block.workflows.resume(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Executions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listExecutions(params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.block.executions.list(params));
  }

  getExecution(uniqueId: string): Observable<Execution> {
    return from(this.block.executions.get(uniqueId));
  }

  listExecutionsByAgent(agentUniqueId: string, params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.block.executions.listByAgent(agentUniqueId, params));
  }

  listExecutionsByPrompt(promptUniqueId: string, params?: ListExecutionsParams): Observable<PageResult<Execution>> {
    return from(this.block.executions.listByPrompt(promptUniqueId, params));
  }

  cancelExecution(uniqueId: string): Observable<Execution> {
    return from(this.block.executions.cancel(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Conversations Service
  // ─────────────────────────────────────────────────────────────────────────────

  listConversations(params?: ListConversationsParams): Observable<PageResult<Conversation>> {
    return from(this.block.conversations.list(params));
  }

  getConversation(uniqueId: string): Observable<Conversation> {
    return from(this.block.conversations.get(uniqueId));
  }

  createConversation(data: CreateConversationRequest): Observable<Conversation> {
    return from(this.block.conversations.create(data));
  }

  sendMessage(uniqueId: string, data: SendMessageRequest): Observable<SendMessageResponse> {
    return from(this.block.conversations.sendMessage(uniqueId, data));
  }

  listConversationsByUser(userUniqueId: string, params?: ListConversationsParams): Observable<PageResult<Conversation>> {
    return from(this.block.conversations.listByUser(userUniqueId, params));
  }

  clearConversation(uniqueId: string): Observable<Conversation> {
    return from(this.block.conversations.clear(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): JarvisBlock {
    return this.block;
  }
}
