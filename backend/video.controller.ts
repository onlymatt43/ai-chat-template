import type { Request, Response } from 'express';
import { runComfyWorkflow } from './comfyui.client';
import { runWanVideo } from './wan.client';

export const postVideo = async (req: Request, res: Response) => {
  try {
    const { workflow, prompt, negative_prompt, img_url, parameters } = req.body;

    // If caller provided a complete workflow, pass it through
    if (workflow) {
      // Prefer WAN if configured and provider set to wan
      if (process.env.VIDEO_PROVIDER === 'wan' || (process.env.WAN_API_KEY && process.env.WAN_API_URL)) {
        const result = await runWanVideo(workflow.input ? { input: workflow.input } : workflow);
        return res.json(result);
      }

      const result = await runComfyWorkflow(workflow);
      return res.json(result);
    }

    // Minimal wrapper to allow calling with prompt only
    const minimalInput = {
      prompt: prompt || '',
      negative_prompt: negative_prompt || '',
      img_url: img_url || '',
      parameters: parameters || {}
    };

    // Use WAN if configured
    if (process.env.VIDEO_PROVIDER === 'wan' || (process.env.WAN_API_KEY && process.env.WAN_API_URL)) {
      const result = await runWanVideo({ input: minimalInput });
      return res.json(result);
    }

    const result = await runComfyWorkflow({ input: minimalInput });
    return res.json(result);
  } catch (err: any) {
    console.error('Video generation error', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Video generation failure', details: err?.message || err });
  }
};
