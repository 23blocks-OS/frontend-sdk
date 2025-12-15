export interface AssetPresignResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
}

export interface CreateAssetImageRequest {
  key: string;
  filename: string;
  contentType: string;
}

export interface AssetImage {
  uniqueId: string;
  url: string;
  filename: string;
  contentType: string;
  createdAt: Date;
}

// Additional asset request types for missing methods
export interface AddToCategoryRequest {
  categoryUniqueId: string;
}

export interface AddPartsRequest {
  partUniqueIds: string[];
}

export interface RemovePartsRequest {
  partUniqueIds: string[];
}

export interface UpdateMaintenanceRequest {
  maintenanceDate?: Date;
  maintenanceInterval?: number;
  maintenanceNotes?: string;
  payload?: Record<string, unknown>;
}

export interface LendAssetRequest {
  userUniqueId: string;
  dueDate?: Date;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface CreateOTPRequest {
  expiresIn?: number;
  payload?: Record<string, unknown>;
}

export interface OTPResponse {
  code: string;
  expiresAt: Date;
}
