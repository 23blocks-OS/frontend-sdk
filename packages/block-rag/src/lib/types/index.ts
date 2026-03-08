export type {
  RagScope,
  ProcessingMode,
  QueryRequest,
  QueryResultChunk,
  QueryMeta,
  QueryResponse,
  ProcessResponse,
  FileMetadata,
} from './scope.js';

export type {
  FileProcessRequest,
} from './file.js';

export type {
  JobStatus,
} from './job.js';

export type {
  ImageUploadRequest,
  ImageUploadResponse,
  UnifiedSearchQuery,
  ImageSearchRequest,
} from './image.js';

export type {
  ProductIdentifyRequest,
  ProductIdentifyResponse,
  ProductSearchRequest,
} from './product.js';

export type {
  EvaluationDataset,
  CreateEvaluationDatasetRequest,
  UpdateEvaluationDatasetRequest,
  ListEvaluationDatasetsParams,
} from './evaluation-dataset.js';

export type {
  EvaluationQuestion,
  CreateEvaluationQuestionsRequest,
  ListEvaluationQuestionsParams,
} from './evaluation-question.js';

export type {
  EvaluationRun,
  EvaluationRunMetrics,
  EvaluationRunProgress,
  CreateEvaluationRunRequest,
  ListEvaluationRunsParams,
  PollOptions,
} from './evaluation-run.js';

export type {
  EvaluationResult,
  ListEvaluationResultsParams,
} from './evaluation-result.js';

export type {
  EvaluationComparisonParams,
  EvaluationComparisonResult,
  EvaluationComparisonRunSummary,
  EvaluationComparisonMetricDelta,
  EvaluationComparisonPerQuestion,
} from './evaluation-comparison.js';
