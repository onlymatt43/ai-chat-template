import type { Request, Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const B2_ENDPOINT = process.env.B2_ENDPOINT;
const B2_KEY = process.env.B2_KEY;
const B2_SECRET = process.env.B2_SECRET;
const B2_BUCKET = process.env.B2_BUCKET;

function ensureB2Config() {
  if (!B2_ENDPOINT || !B2_KEY || !B2_SECRET || !B2_BUCKET) {
    throw new Error('Backblaze B2 is not configured (B2_KEY/B2_SECRET/B2_ENDPOINT/B2_BUCKET)');
  }
}

export const presignUpload = async (req: Request, res: Response) => {
  try {
    ensureB2Config();

    const { filename, contentType = 'application/octet-stream', expiresIn = 3600 } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const s3 = new S3Client({
      endpoint: B2_ENDPOINT,
      region: 'us-west-002',
      credentials: {
        accessKeyId: B2_KEY!,
        secretAccessKey: B2_SECRET!
      },
      forcePathStyle: true
    });

    const key = filename;
    const cmd = new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: key,
      ContentType: contentType
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: Number(expiresIn) });

    res.json({ url, key, bucket: B2_BUCKET });
  } catch (err: any) {
    console.error('Presign error', err.message || err);
    res.status(500).json({ error: 'Could not generate presigned URL', details: err.message || err });
  }
};
