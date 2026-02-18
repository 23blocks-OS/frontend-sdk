export interface StepTransition {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  transitionType?: string;
  priority?: number;
  isDefault?: boolean;
  allowsBackward?: boolean;
  maxIterations?: number;
  onLoop?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches step_transition_params in step_transitions_controller.rb */
export interface CreateStepTransitionRequest {
  name: string;
  description?: string;
  transitionType?: string;
  priority?: number;
  isDefault?: boolean;
  allowsBackward?: boolean;
  maxIterations?: number;
  onLoop?: string;
}

export type UpdateStepTransitionRequest = CreateStepTransitionRequest;

export interface ListStepTransitionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
