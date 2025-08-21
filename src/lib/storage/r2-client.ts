export function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('Missing Cloudflare R2 environment variables');
  }
  
  return { accountId, accessKeyId, secretAccessKey, bucketName };
}