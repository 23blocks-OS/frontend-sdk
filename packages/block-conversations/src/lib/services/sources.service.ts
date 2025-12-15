import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { Source } from '../types/source';
import { sourceMapper } from '../mappers/source.mapper';

export interface SourcesService {
  get(uniqueId: string): Promise<Source>;
}

export function createSourcesService(transport: Transport, _config: { appId: string }): SourcesService {
  return {
    async get(uniqueId: string): Promise<Source> {
      const response = await transport.get<unknown>(`/sources/${uniqueId}`);
      return decodeOne(response, sourceMapper);
    },
  };
}
