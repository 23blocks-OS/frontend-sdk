export interface CompanyKey {
  id: string;
  uniqueId: string;
  name?: string;
  keyValue?: string;
  provider?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyKeyRequest {
  name?: string;
  keyValue: string;
  provider?: string;
  apiSecret?: string;
  baseUrl?: string;
}
