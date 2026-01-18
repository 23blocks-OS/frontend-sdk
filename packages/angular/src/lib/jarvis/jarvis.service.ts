import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createJarvisBlock,
  type JarvisBlock,
  type JarvisBlockConfig,
  // Agents
  type Agent,
  type CreateAgentRequest,
  type UpdateAgentRequest,
  type ListAgentsParams,
  type ChatRequest,
  type ChatResponse,
  type CompleteRequest,
  type CompleteResponse,
  // Prompts
  type Prompt,
  type CreatePromptRequest,
  type UpdatePromptRequest,
  type ListPromptsParams,
  type ExecutePromptRequest,
  type ExecutePromptResponse,
  type TestPromptRequest,
  type TestPromptResponse,
  type RenderPromptRequest,
  type RenderPromptResponse,
  // Workflows
  type Workflow,
  type CreateWorkflowRequest,
  type UpdateWorkflowRequest,
  type ListWorkflowsParams,
  type RunWorkflowRequest,
  type RunWorkflowResponse,
  // Executions
  type Execution,
  type ListExecutionsParams,
  // Conversations
  type Conversation,
  type CreateConversationRequest,
  type SendMessageRequest,
  type SendMessageResponse,
  type ListConversationsParams,
  // AI Models
  type AIModel,
  type CreateAIModelRequest,
  type UpdateAIModelRequest,
  type ListAIModelsParams,
  // Entities
  type Entity,
  type RegisterEntityRequest,
  type UpdateEntityRequest,
  type ListEntitiesParams,
  type EntityContext,
  type CreateEntityContextRequest,
  type SendEntityMessageRequest,
  type SendEntityMessageResponse,
  type QueryEntityFileRequest,
  type QueryEntityFileResponse,
  // Clusters
  type Cluster,
  type CreateClusterRequest,
  type UpdateClusterRequest,
  type ListClustersParams,
  type ClusterContext,
  type CreateClusterContextRequest,
  type SendClusterMessageRequest,
  type SendClusterMessageResponse,
  // Users (Jarvis)
  type JarvisUser,
  type RegisterJarvisUserRequest,
  type UpdateJarvisUserRequest,
  type ListJarvisUsersParams,
  type UserContext,
  type CreateUserContextRequest,
  type SendUserMessageRequest,
  type SendUserMessageResponse,
  type CreateUserContentContextRequest,
  // Workflow Participants
  type WorkflowParticipant,
  type AddWorkflowParticipantRequest,
  type UpdateWorkflowParticipantRequest,
  type ListWorkflowParticipantsParams,
  // Workflow Steps
  type WorkflowStep,
  type AddWorkflowStepRequest,
  type UpdateWorkflowStepRequest,
  type AddStepPromptRequest,
  type AddStepAgentRequest,
  // Workflow Instances
  type WorkflowInstance,
  type WorkflowInstanceDetails,
  type StartWorkflowRequest as StartWorkflowInstanceRequest,
  type StartWorkflowResponse as StartWorkflowInstanceResponse,
  type StepWorkflowRequest,
  type LogWorkflowStepRequest,
  // Agent Runtime
  type AgentThread,
  type AgentRun,
  type AgentMessage,
  type AgentContext,
  type CreateAgentThreadRequest,
  type CreateAgentContextRequest,
  type SendAgentThreadMessageRequest,
  type SendAgentThreadMessageResponse,
  type RunAgentThreadRequest,
  type RunAgentThreadResponse,
  type AgentRunExecution,
  type ListAgentRunExecutionsParams,
  // Mail Templates
  type MailTemplate,
  type CreateMailTemplateRequest,
  type UpdateMailTemplateRequest,
  type ListMailTemplatesParams,
  type CreateMandrillTemplateRequest,
  type UpdateMandrillTemplateRequest,
  type MandrillStats,
  // Marvin Chat
  type MarvinContext,
  type MarvinChatRequest,
  type MarvinChatResponse,
  type CreateMarvinContextRequest,
  type SendMarvinMessageRequest,
  type SendMarvinMessageResponse,
  // Comments
  type PromptComment,
  type ExecutionComment,
  type CreatePromptCommentRequest,
  type UpdatePromptCommentRequest,
  type ListPromptCommentsParams,
  type CreateExecutionCommentRequest,
  type UpdateExecutionCommentRequest,
  type ListExecutionCommentsParams,
  type ReplyToCommentRequest,
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

  renderPrompt(uniqueId: string, data: RenderPromptRequest): Observable<RenderPromptResponse> {
    return from(this.ensureConfigured().prompts.render(uniqueId, data));
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
  // AI Models Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAIModels(params?: ListAIModelsParams): Observable<PageResult<AIModel>> {
    return from(this.ensureConfigured().aiModels.list(params));
  }

  getAIModel(uniqueId: string): Observable<AIModel> {
    return from(this.ensureConfigured().aiModels.get(uniqueId));
  }

  createAIModel(data: CreateAIModelRequest): Observable<AIModel> {
    return from(this.ensureConfigured().aiModels.create(data));
  }

  updateAIModel(uniqueId: string, data: UpdateAIModelRequest): Observable<AIModel> {
    return from(this.ensureConfigured().aiModels.update(uniqueId, data));
  }

  deleteAIModel(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().aiModels.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Entities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listEntities(params?: ListEntitiesParams): Observable<PageResult<Entity>> {
    return from(this.ensureConfigured().entities.list(params));
  }

  getEntity(uniqueId: string): Observable<Entity> {
    return from(this.ensureConfigured().entities.get(uniqueId));
  }

  registerEntity(uniqueId: string, data?: RegisterEntityRequest): Observable<Entity> {
    return from(this.ensureConfigured().entities.register(uniqueId, data));
  }

  updateEntity(uniqueId: string, data: UpdateEntityRequest): Observable<Entity> {
    return from(this.ensureConfigured().entities.update(uniqueId, data));
  }

  deleteEntity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.delete(uniqueId));
  }

  addEntityPrompt(uniqueId: string, promptUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.addPrompt(uniqueId, promptUniqueId));
  }

  getEntityContext(uniqueId: string, contextUniqueId: string): Observable<EntityContext> {
    return from(this.ensureConfigured().entities.getContext(uniqueId, contextUniqueId));
  }

  createEntityContext(uniqueId: string, data?: CreateEntityContextRequest): Observable<EntityContext> {
    return from(this.ensureConfigured().entities.createContext(uniqueId, data));
  }

  getEntityConversation(uniqueId: string, contextUniqueId: string): Observable<EntityContext> {
    return from(this.ensureConfigured().entities.getConversation(uniqueId, contextUniqueId));
  }

  sendEntityMessage(uniqueId: string, contextUniqueId: string, data: SendEntityMessageRequest): Observable<SendEntityMessageResponse> {
    return from(this.ensureConfigured().entities.sendMessage(uniqueId, contextUniqueId, data));
  }

  queryEntityFile(uniqueId: string, fileUniqueId: string, data: QueryEntityFileRequest): Observable<QueryEntityFileResponse> {
    return from(this.ensureConfigured().entities.queryFile(uniqueId, fileUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Clusters Service
  // ─────────────────────────────────────────────────────────────────────────────

  listClusters(userUniqueId: string, params?: ListClustersParams): Observable<PageResult<Cluster>> {
    return from(this.ensureConfigured().clusters.list(userUniqueId, params));
  }

  getCluster(userUniqueId: string, uniqueId: string): Observable<Cluster> {
    return from(this.ensureConfigured().clusters.get(userUniqueId, uniqueId));
  }

  createCluster(userUniqueId: string, data: CreateClusterRequest): Observable<Cluster> {
    return from(this.ensureConfigured().clusters.create(userUniqueId, data));
  }

  updateCluster(userUniqueId: string, uniqueId: string, data: UpdateClusterRequest): Observable<Cluster> {
    return from(this.ensureConfigured().clusters.update(userUniqueId, uniqueId, data));
  }

  deleteCluster(userUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().clusters.delete(userUniqueId, uniqueId));
  }

  addClusterMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().clusters.addMember(userUniqueId, uniqueId, entityUniqueId));
  }

  removeClusterMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().clusters.removeMember(userUniqueId, uniqueId, entityUniqueId));
  }

  addClusterPrompt(userUniqueId: string, uniqueId: string, promptUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().clusters.addPrompt(userUniqueId, uniqueId, promptUniqueId));
  }

  getClusterContext(userUniqueId: string, uniqueId: string, contextUniqueId: string): Observable<ClusterContext> {
    return from(this.ensureConfigured().clusters.getContext(userUniqueId, uniqueId, contextUniqueId));
  }

  createClusterContext(userUniqueId: string, uniqueId: string, data?: CreateClusterContextRequest): Observable<ClusterContext> {
    return from(this.ensureConfigured().clusters.createContext(userUniqueId, uniqueId, data));
  }

  getClusterConversation(userUniqueId: string, uniqueId: string, contextUniqueId: string): Observable<ClusterContext> {
    return from(this.ensureConfigured().clusters.getConversation(userUniqueId, uniqueId, contextUniqueId));
  }

  sendClusterMessage(userUniqueId: string, uniqueId: string, contextUniqueId: string, data: SendClusterMessageRequest): Observable<SendClusterMessageResponse> {
    return from(this.ensureConfigured().clusters.sendMessage(userUniqueId, uniqueId, contextUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Jarvis Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  listJarvisUsers(params?: ListJarvisUsersParams): Observable<PageResult<JarvisUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getJarvisUser(uniqueId: string): Observable<JarvisUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerJarvisUser(uniqueId: string, data?: RegisterJarvisUserRequest): Observable<JarvisUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  updateJarvisUser(uniqueId: string, data: UpdateJarvisUserRequest): Observable<JarvisUser> {
    return from(this.ensureConfigured().users.update(uniqueId, data));
  }

  addJarvisUserPrompt(uniqueId: string, promptUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.addPrompt(uniqueId, promptUniqueId));
  }

  getJarvisUserContext(uniqueId: string, contextUniqueId: string): Observable<UserContext> {
    return from(this.ensureConfigured().users.getContext(uniqueId, contextUniqueId));
  }

  createJarvisUserContext(uniqueId: string, data?: CreateUserContextRequest): Observable<UserContext> {
    return from(this.ensureConfigured().users.createContext(uniqueId, data));
  }

  getJarvisUserConversation(uniqueId: string, contextUniqueId: string): Observable<UserContext> {
    return from(this.ensureConfigured().users.getConversation(uniqueId, contextUniqueId));
  }

  sendJarvisUserMessage(uniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Observable<SendUserMessageResponse> {
    return from(this.ensureConfigured().users.sendMessage(uniqueId, contextUniqueId, data));
  }

  getJarvisUserContentContext(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Observable<UserContext> {
    return from(this.ensureConfigured().users.getContentContext(uniqueId, contentIdentityUniqueId, contextUniqueId));
  }

  createJarvisUserContentContext(uniqueId: string, contentIdentityUniqueId: string, data?: CreateUserContentContextRequest): Observable<UserContext> {
    return from(this.ensureConfigured().users.createContentContext(uniqueId, contentIdentityUniqueId, data));
  }

  getJarvisUserContentConversation(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Observable<UserContext> {
    return from(this.ensureConfigured().users.getContentConversation(uniqueId, contentIdentityUniqueId, contextUniqueId));
  }

  sendJarvisUserContentMessage(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Observable<SendUserMessageResponse> {
    return from(this.ensureConfigured().users.sendContentMessage(uniqueId, contentIdentityUniqueId, contextUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflow Participants Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWorkflowParticipants(workflowUniqueId: string, params?: ListWorkflowParticipantsParams): Observable<PageResult<WorkflowParticipant>> {
    return from(this.ensureConfigured().workflowParticipants.list(workflowUniqueId, params));
  }

  getWorkflowParticipant(workflowUniqueId: string, uniqueId: string): Observable<WorkflowParticipant> {
    return from(this.ensureConfigured().workflowParticipants.get(workflowUniqueId, uniqueId));
  }

  addWorkflowParticipant(workflowUniqueId: string, data: AddWorkflowParticipantRequest): Observable<WorkflowParticipant> {
    return from(this.ensureConfigured().workflowParticipants.add(workflowUniqueId, data));
  }

  updateWorkflowParticipant(workflowUniqueId: string, uniqueId: string, data: UpdateWorkflowParticipantRequest): Observable<WorkflowParticipant> {
    return from(this.ensureConfigured().workflowParticipants.update(workflowUniqueId, uniqueId, data));
  }

  removeWorkflowParticipant(workflowUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().workflowParticipants.remove(workflowUniqueId, uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflow Steps Service
  // ─────────────────────────────────────────────────────────────────────────────

  getWorkflowStep(workflowUniqueId: string, stepUniqueId: string): Observable<WorkflowStep> {
    return from(this.ensureConfigured().workflowSteps.get(workflowUniqueId, stepUniqueId));
  }

  addWorkflowStep(workflowUniqueId: string, data: AddWorkflowStepRequest): Observable<WorkflowStep> {
    return from(this.ensureConfigured().workflowSteps.add(workflowUniqueId, data));
  }

  updateWorkflowStep(workflowUniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Observable<WorkflowStep> {
    return from(this.ensureConfigured().workflowSteps.update(workflowUniqueId, stepUniqueId, data));
  }

  removeWorkflowStep(workflowUniqueId: string, stepUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().workflowSteps.remove(workflowUniqueId, stepUniqueId));
  }

  addStepPrompt(stepUniqueId: string, data: AddStepPromptRequest): Observable<void> {
    return from(this.ensureConfigured().workflowSteps.addPrompt(stepUniqueId, data));
  }

  addStepAgent(stepUniqueId: string, data: AddStepAgentRequest): Observable<void> {
    return from(this.ensureConfigured().workflowSteps.addAgent(stepUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflow Instances Service
  // ─────────────────────────────────────────────────────────────────────────────

  startWorkflowInstance(workflowUniqueId: string, data?: StartWorkflowInstanceRequest): Observable<StartWorkflowInstanceResponse> {
    return from(this.ensureConfigured().workflowInstances.start(workflowUniqueId, data));
  }

  getWorkflowInstance(workflowUniqueId: string, instanceUniqueId: string): Observable<WorkflowInstance> {
    return from(this.ensureConfigured().workflowInstances.get(workflowUniqueId, instanceUniqueId));
  }

  getWorkflowInstanceDetails(workflowUniqueId: string, instanceUniqueId: string): Observable<WorkflowInstanceDetails> {
    return from(this.ensureConfigured().workflowInstances.getDetails(workflowUniqueId, instanceUniqueId));
  }

  stepWorkflowInstance(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Observable<WorkflowInstance> {
    return from(this.ensureConfigured().workflowInstances.step(workflowUniqueId, instanceUniqueId, data));
  }

  logWorkflowStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Observable<WorkflowInstance> {
    return from(this.ensureConfigured().workflowInstances.logStep(workflowUniqueId, instanceUniqueId, data));
  }

  suspendWorkflowInstance(workflowUniqueId: string, instanceUniqueId: string): Observable<WorkflowInstance> {
    return from(this.ensureConfigured().workflowInstances.suspend(workflowUniqueId, instanceUniqueId));
  }

  resumeWorkflowInstance(workflowUniqueId: string, instanceUniqueId: string): Observable<WorkflowInstance> {
    return from(this.ensureConfigured().workflowInstances.resume(workflowUniqueId, instanceUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agent Runtime Service
  // ─────────────────────────────────────────────────────────────────────────────

  getAgentContext(agentUniqueId: string, contextUniqueId: string): Observable<AgentContext> {
    return from(this.ensureConfigured().agentRuntime.getContext(agentUniqueId, contextUniqueId));
  }

  createAgentContext(agentUniqueId: string, data?: CreateAgentContextRequest): Observable<AgentContext> {
    return from(this.ensureConfigured().agentRuntime.createContext(agentUniqueId, data));
  }

  getAgentConversation(agentUniqueId: string, contextUniqueId: string): Observable<{ messages: AgentMessage[] }> {
    return from(this.ensureConfigured().agentRuntime.getConversation(agentUniqueId, contextUniqueId));
  }

  getAgentThread(agentUniqueId: string, threadId: string): Observable<AgentThread> {
    return from(this.ensureConfigured().agentRuntime.getThread(agentUniqueId, threadId));
  }

  createAgentThread(agentUniqueId: string, data?: CreateAgentThreadRequest): Observable<AgentThread> {
    return from(this.ensureConfigured().agentRuntime.createThread(agentUniqueId, data));
  }

  sendAgentThreadMessage(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Observable<SendAgentThreadMessageResponse> {
    return from(this.ensureConfigured().agentRuntime.sendMessage(agentUniqueId, threadId, data));
  }

  sendAgentThreadMessageStream(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Observable<ReadableStream<string>> {
    return from(this.ensureConfigured().agentRuntime.sendMessageStream(agentUniqueId, threadId, data));
  }

  runAgentThread(agentUniqueId: string, threadId: string, data?: RunAgentThreadRequest): Observable<RunAgentThreadResponse> {
    return from(this.ensureConfigured().agentRuntime.runThread(agentUniqueId, threadId, data));
  }

  getAgentRun(agentUniqueId: string, threadId: string, runId: string): Observable<AgentRun> {
    return from(this.ensureConfigured().agentRuntime.getRun(agentUniqueId, threadId, runId));
  }

  getAgentMessages(agentUniqueId: string, threadId: string): Observable<AgentMessage[]> {
    return from(this.ensureConfigured().agentRuntime.getMessages(agentUniqueId, threadId));
  }

  listAgentExecutions(agentUniqueId: string, params?: ListAgentRunExecutionsParams): Observable<PageResult<AgentRunExecution>> {
    return from(this.ensureConfigured().agentRuntime.listExecutions(agentUniqueId, params));
  }

  getAgentExecution(agentUniqueId: string, executionUniqueId: string): Observable<AgentRunExecution> {
    return from(this.ensureConfigured().agentRuntime.getExecution(agentUniqueId, executionUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Mail Templates Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMailTemplates(params?: ListMailTemplatesParams): Observable<PageResult<MailTemplate>> {
    return from(this.ensureConfigured().mailTemplates.list(params));
  }

  getMailTemplate(uniqueId: string): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.get(uniqueId));
  }

  createMailTemplate(data: CreateMailTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.create(data));
  }

  updateMailTemplate(uniqueId: string, data: UpdateMailTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.update(uniqueId, data));
  }

  createMandrillTemplate(uniqueId: string, data?: CreateMandrillTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.createMandrillTemplate(uniqueId, data));
  }

  updateMandrillTemplate(uniqueId: string, data?: UpdateMandrillTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.updateMandrillTemplate(uniqueId, data));
  }

  publishMandrill(uniqueId: string): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.publishMandrill(uniqueId));
  }

  getMandrillStats(uniqueId: string): Observable<MandrillStats> {
    return from(this.ensureConfigured().mailTemplates.getMandrillStats(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Marvin Chat Service
  // ─────────────────────────────────────────────────────────────────────────────

  marvinChat(data: MarvinChatRequest): Observable<MarvinChatResponse> {
    return from(this.ensureConfigured().marvinChat.chat(data));
  }

  marvinChatV2(data: MarvinChatRequest): Observable<MarvinChatResponse> {
    return from(this.ensureConfigured().marvinChat.chatV2(data));
  }

  marvinChatV3(data: MarvinChatRequest): Observable<MarvinChatResponse> {
    return from(this.ensureConfigured().marvinChat.chatV3(data));
  }

  getMarvinContext(uniqueId: string): Observable<MarvinContext> {
    return from(this.ensureConfigured().marvinChat.getContext(uniqueId));
  }

  createMarvinContext(data?: CreateMarvinContextRequest): Observable<MarvinContext> {
    return from(this.ensureConfigured().marvinChat.createContext(data));
  }

  sendMarvinMessage(contextUniqueId: string, data: SendMarvinMessageRequest): Observable<SendMarvinMessageResponse> {
    return from(this.ensureConfigured().marvinChat.sendMessage(contextUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Prompt Comments Service
  // ─────────────────────────────────────────────────────────────────────────────

  listPromptComments(promptUniqueId: string, params?: ListPromptCommentsParams): Observable<PageResult<PromptComment>> {
    return from(this.ensureConfigured().promptComments.list(promptUniqueId, params));
  }

  getPromptComment(promptUniqueId: string, uniqueId: string): Observable<PromptComment> {
    return from(this.ensureConfigured().promptComments.get(promptUniqueId, uniqueId));
  }

  createPromptComment(promptUniqueId: string, data: CreatePromptCommentRequest): Observable<PromptComment> {
    return from(this.ensureConfigured().promptComments.create(promptUniqueId, data));
  }

  updatePromptComment(promptUniqueId: string, uniqueId: string, data: UpdatePromptCommentRequest): Observable<PromptComment> {
    return from(this.ensureConfigured().promptComments.update(promptUniqueId, uniqueId, data));
  }

  deletePromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.delete(promptUniqueId, uniqueId));
  }

  likePromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.like(promptUniqueId, uniqueId));
  }

  dislikePromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.dislike(promptUniqueId, uniqueId));
  }

  replyToPromptComment(promptUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Observable<PromptComment> {
    return from(this.ensureConfigured().promptComments.reply(promptUniqueId, uniqueId, data));
  }

  followPromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.follow(promptUniqueId, uniqueId));
  }

  unfollowPromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.unfollow(promptUniqueId, uniqueId));
  }

  savePromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.save(promptUniqueId, uniqueId));
  }

  unsavePromptComment(promptUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().promptComments.unsave(promptUniqueId, uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Execution Comments Service
  // ─────────────────────────────────────────────────────────────────────────────

  listExecutionComments(promptUniqueId: string, executionUniqueId: string, params?: ListExecutionCommentsParams): Observable<PageResult<ExecutionComment>> {
    return from(this.ensureConfigured().executionComments.list(promptUniqueId, executionUniqueId, params));
  }

  getExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<ExecutionComment> {
    return from(this.ensureConfigured().executionComments.get(promptUniqueId, executionUniqueId, uniqueId));
  }

  createExecutionComment(promptUniqueId: string, executionUniqueId: string, data: CreateExecutionCommentRequest): Observable<ExecutionComment> {
    return from(this.ensureConfigured().executionComments.create(promptUniqueId, executionUniqueId, data));
  }

  updateExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: UpdateExecutionCommentRequest): Observable<ExecutionComment> {
    return from(this.ensureConfigured().executionComments.update(promptUniqueId, executionUniqueId, uniqueId, data));
  }

  deleteExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.delete(promptUniqueId, executionUniqueId, uniqueId));
  }

  likeExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.like(promptUniqueId, executionUniqueId, uniqueId));
  }

  dislikeExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.dislike(promptUniqueId, executionUniqueId, uniqueId));
  }

  replyToExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Observable<ExecutionComment> {
    return from(this.ensureConfigured().executionComments.reply(promptUniqueId, executionUniqueId, uniqueId, data));
  }

  followExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.follow(promptUniqueId, executionUniqueId, uniqueId));
  }

  unfollowExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.unfollow(promptUniqueId, executionUniqueId, uniqueId));
  }

  saveExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.save(promptUniqueId, executionUniqueId, uniqueId));
  }

  unsaveExecutionComment(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().executionComments.unsave(promptUniqueId, executionUniqueId, uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get jarvisBlock(): JarvisBlock {
    return this.ensureConfigured();
  }
}
