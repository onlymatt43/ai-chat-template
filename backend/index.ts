import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './chat.routes';
import { postVideo } from './video.controller';
import { presignUpload } from './upload.controller';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chat', chatRouter);
app.post('/api/video', postVideo);
app.post('/api/upload/presign', presignUpload);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
