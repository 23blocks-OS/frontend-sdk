# @23blocks/block-files

Files block for the 23blocks SDK - file uploads, storage, and entity attachments.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-files.svg)](https://www.npmjs.com/package/@23blocks/block-files)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-files @23blocks/transport-http
```

## Overview

This package provides file management functionality including:

- **Storage Files** - Direct file uploads and management
- **Entity Files** - Attach files to other entities
- **File Schemas** - Define file requirements and validations

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createFilesBlock } from '@23blocks/block-files';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const files = createFilesBlock(transport, {
  apiKey: 'your-api-key',
});

// List files
const { data: fileList } = await files.storageFiles.list({ limit: 20 });

fileList.forEach((file) => {
  console.log(file.filename, file.size, file.url);
});
```

## Services

### storageFiles - File Storage

```typescript
// List files
const { data: fileList, meta } = await files.storageFiles.list({
  limit: 20,
  folder: 'images',
});

// Get file by ID
const file = await files.storageFiles.get('file-id');

// Upload file
const newFile = await files.storageFiles.upload({
  file: fileBlob,
  filename: 'document.pdf',
  folder: 'documents',
  contentType: 'application/pdf',
});

// Create file record (for external URLs)
const fileRecord = await files.storageFiles.create({
  filename: 'external-image.jpg',
  url: 'https://example.com/image.jpg',
  contentType: 'image/jpeg',
  size: 12345,
});

// Update file metadata
const updated = await files.storageFiles.update('file-id', {
  filename: 'renamed-document.pdf',
  folder: 'archived',
});

// Delete file
await files.storageFiles.delete('file-id');

// Get download URL
const downloadUrl = await files.storageFiles.getDownloadUrl('file-id');
```

### entityFiles - Entity Attachments

```typescript
// List files attached to an entity
const { data: attachments } = await files.entityFiles.list({
  entityType: 'product',
  entityId: 'product-123',
});

// Attach file to entity
const attachment = await files.entityFiles.attach({
  entityType: 'product',
  entityId: 'product-123',
  fileId: 'file-id',
  position: 1,
  label: 'Main Image',
});

// Update attachment
const updated = await files.entityFiles.update('attachment-id', {
  position: 2,
  label: 'Secondary Image',
});

// Reorder files
await files.entityFiles.reorder({
  entityType: 'product',
  entityId: 'product-123',
  fileIds: ['file-1', 'file-2', 'file-3'],
});

// Remove attachment
await files.entityFiles.delete('attachment-id');
```

### fileSchemas - File Schemas

```typescript
// List file schemas
const { data: schemas } = await files.fileSchemas.list();

// Get schema by ID
const schema = await files.fileSchemas.get('schema-id');

// Create file schema
const newSchema = await files.fileSchemas.create({
  name: 'Product Images',
  entityType: 'product',
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  required: true,
});

// Update schema
const updated = await files.fileSchemas.update('schema-id', {
  maxFiles: 20,
});

// Delete schema
await files.fileSchemas.delete('schema-id');
```

## Types

```typescript
import type {
  StorageFile,
  EntityFile,
  FileSchema,
  CreateStorageFileRequest,
  UploadFileRequest,
  AttachFileRequest,
  CreateFileSchemaRequest,
  ListStorageFilesParams,
} from '@23blocks/block-files';
```

### StorageFile

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | File ID |
| `uniqueId` | `string` | Unique identifier |
| `filename` | `string` | Original filename |
| `contentType` | `string` | MIME type |
| `size` | `number` | File size in bytes |
| `url` | `string` | Public URL |
| `folder` | `string` | Storage folder |
| `createdAt` | `Date` | Upload timestamp |

### EntityFile

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Attachment ID |
| `entityType` | `string` | Type of parent entity |
| `entityId` | `string` | Parent entity ID |
| `fileId` | `string` | Attached file ID |
| `position` | `number` | Display order |
| `label` | `string` | Display label |
| `file` | `StorageFile` | File details |

### FileSchema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Schema ID |
| `name` | `string` | Schema name |
| `entityType` | `string` | Entity type this applies to |
| `allowedTypes` | `string[]` | Allowed MIME types |
| `maxSize` | `number` | Max file size in bytes |
| `maxFiles` | `number` | Max number of files |
| `required` | `boolean` | Whether files are required |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await files.storageFiles.upload({ file: largeFile, filename: 'huge.zip' });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.VALIDATION_ERROR:
        console.log('File too large or invalid type');
        break;
      case ErrorCodes.FORBIDDEN:
        console.log('Not authorized to upload files');
        break;
    }
  }
}
```

## Advanced Usage

### Uploading with Progress

```typescript
// Use FormData for browser uploads with progress
async function uploadWithProgress(file: File, onProgress: (percent: number) => void) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    };
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.open('POST', 'https://api.yourapp.com/files');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
}
```

## Related Packages

- [`@23blocks/block-content`](https://www.npmjs.com/package/@23blocks/block-content) - Content management
- [`@23blocks/block-products`](https://www.npmjs.com/package/@23blocks/block-products) - Product images
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
