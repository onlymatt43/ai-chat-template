import axios from 'axios';

const COMFY_URL = process.env.COMFYUI_API_URL;
const COMFY_KEY = process.env.COMFYUI_API_KEY;

export async function runComfyWorkflow(workflow: any) {
  if (!COMFY_URL) throw new Error('COMFYUI_API_URL not configured');

  const endpoint = COMFY_URL.endsWith('/run') ? COMFY_URL : `${COMFY_URL.replace(/\/$/, '')}/run`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (COMFY_KEY) headers['Authorization'] = `Bearer ${COMFY_KEY}`;

  const resp = await axios.post(endpoint, workflow, { headers, timeout: 120000 });
  return resp.data;
}
