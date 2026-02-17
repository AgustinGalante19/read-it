import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.BUCKET_ENDPOINT || '',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY || '',
    secretAccessKey: process.env.BUCKET_ACCESS_SECRET || '',
  },
});

export default s3;
