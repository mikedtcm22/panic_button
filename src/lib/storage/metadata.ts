import { prisma } from '@/lib/database';

interface FileMetadata {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
}

export async function saveFileMetadata(metadata: FileMetadata) {
  return await prisma.file.create({
    data: {
      userId: metadata.userId,
      fileName: metadata.fileName,
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
      storageKey: metadata.storageKey,
    },
  });
}