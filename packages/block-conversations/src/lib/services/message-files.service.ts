import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  MessageFile,
  CreateMessageFileRequest,
  PresignMessageFileRequest,
  PresignMessageFileResponse,
} from '../types/message-file';
import { messageFileMapper } from '../mappers/message-file.mapper';

export interface MessageFilesService {
  get(conversationUniqueId: string, fileUniqueId: string): Promise<MessageFile>;
  create(conversationUniqueId: string, data: CreateMessageFileRequest): Promise<MessageFile>;
  delete(conversationUniqueId: string, fileUniqueId: string): Promise<void>;
  presign(conversationUniqueId: string, data: PresignMessageFileRequest): Promise<PresignMessageFileResponse>;
}

export function createMessageFilesService(transport: Transport, _config: { appId: string }): MessageFilesService {
  return {
    async get(conversationUniqueId: string, fileUniqueId: string): Promise<MessageFile> {
      const response = await transport.get<unknown>(`/conversations/${conversationUniqueId}/files/${fileUniqueId}`);
      return decodeOne(response, messageFileMapper);
    },

    async create(conversationUniqueId: string, data: CreateMessageFileRequest): Promise<MessageFile> {
      const response = await transport.post<unknown>(`/conversations/${conversationUniqueId}/files`, {
        message_file: {
          name: data.name,
          content_type: data.contentType,
          size: data.size,
          url: data.url,
          message_unique_id: data.messageUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, messageFileMapper);
    },

    async delete(conversationUniqueId: string, fileUniqueId: string): Promise<void> {
      await transport.delete(`/conversations/${conversationUniqueId}/files/${fileUniqueId}`);
    },

    async presign(conversationUniqueId: string, data: PresignMessageFileRequest): Promise<PresignMessageFileResponse> {
      const response = await transport.put<{ data: any }>(`/conversations/${conversationUniqueId}/presign`, {
        file: {
          filename: data.filename,
          content_type: data.contentType,
          size: data.size,
        },
      });

      const result = response.data || response;
      return {
        uploadUrl: result.upload_url || result.uploadUrl,
        fileUrl: result.file_url || result.fileUrl,
        fields: result.fields,
        expiresAt: result.expires_at ? new Date(result.expires_at) : undefined,
      };
    },
  };
}
