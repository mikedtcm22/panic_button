import { createFile } from '@/lib/database/models/file';

interface FileMetadata {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  campaignId?: string;
}

export async function saveFileMetadata(metadata: FileMetadata) {
  return await createFile({
    userId: metadata.userId,
    fileName: metadata.fileName,
    fileType: metadata.fileType,
    fileSize: metadata.fileSize,
    storageKey: metadata.storageKey,
    campaignId: metadata.campaignId,
  });
}