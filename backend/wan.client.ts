import axios from 'axios';

const WAN_URL = process.env.WAN_API_URL;
const WAN_KEY = process.env.WAN_API_KEY;

if (!WAN_URL) {
  // no-op - will be handled by controller
}

export async function runWanVideo(input: any) {
  if (!WAN_URL) throw new Error('WAN_API_URL not configured');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (WAN_KEY) headers['Authorization'] = `Bearer ${WAN_KEY}`;

  const resp = await axios.post(WAN_URL, { input }, { headers, timeout: 120000 });
  return resp.data;
}
