import type { Request, Response } from 'express';
import { runComfyWorkflow } from './comfyui.client';

export const postVideo = async (req: Request, res: Response) => {
  try {
    const { workflow, prompt, negative_prompt, img_url, parameters } = req.body;

    // If caller provided a complete workflow, pass it through
    if (workflow) {
      const result = await runComfyWorkflow(workflow);
      return res.json(result);
    }

    // Minimal wrapper to allow calling with prompt only
    const minimalWorkflow = {
      input: {
        prompt: prompt || '',
        negative_prompt: negative_prompt || '',
        img_url: img_url || '',
        parameters: parameters || {}
      }
    };

    const result = await runComfyWorkflow(minimalWorkflow);
    return res.json(result);
  } catch (err: any) {
    console.error('Video generation error', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Video generation failure', details: err?.message || err });
  }
};
