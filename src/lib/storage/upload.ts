import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client, getR2Config } from './r2-client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFileToR2(file: File, userId: string) {
  const client = createR2Client();
  const config = getR2Config();

  const fileKey = `${userId}/campaigns/${uuidv4()}/${file.name}`;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: fileKey,
    Body: file,
    ContentType: file.type,
  });

  await client.send(command);

  return {
    key: fileKey,
    url: `https://${config.accountId}.r2.cloudflarestorage.com/${fileKey}`,
  };
}
