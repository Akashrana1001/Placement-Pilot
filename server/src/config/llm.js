/**
 * llm.js — Unified LLM Adapter
 *
 * Auto-selects the backend:
 *   • GROQ_API_KEY is set  → Groq Cloud (fast, for production/Render)
 *   • Otherwise            → Local Ollama (private, for local dev)
 *
 * Both adapters present the same interface: llm.generate(agentType, prompt)
 */

import Groq from 'groq-sdk';
import axios from 'axios';
import { logger } from '../utils/logger.js';

// ── Groq adapter ─────────────────────────────────────────────────────────────
async function generateWithGroq(prompt) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const model = process.env.GROQ_MODEL || 'llama3-8b-8192';

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.1,
    max_tokens: 500,
    stop: ['Observation:', 'Human:', 'User:']
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');
  return text;
}

// ── Ollama adapter ────────────────────────────────────────────────────────────
async function generateWithOllama(prompt) {
  const url   = process.env.OLLAMA_URL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

  const response = await axios.post(`${url}/api/generate`, {
    model,
    prompt,
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 400,
      stop: ['Observation:', 'Human:', 'User:', '\n\n\n']
    }
  });

  if (!response.data?.response) throw new Error('Empty response from Ollama');
  return response.data.response;
}

// ── Public interface ─────────────────────────────────────────────────────────
export const llm = {
  /**
   * generate(agentType, prompt) → string
   * Routes to Groq (cloud) or Ollama (local) based on env config.
   */
  generate: async (agentType, prompt) => {
    const useGroq = !!process.env.GROQ_API_KEY;

    try {
      if (useGroq) {
        logger.info(`🤖 [${agentType}] Using Groq (${process.env.GROQ_MODEL || 'llama3-8b-8192'})`);
        return await generateWithGroq(prompt);
      } else {
        logger.info(`🤖 [${agentType}] Using Ollama (${process.env.OLLAMA_MODEL || 'qwen2.5:3b'})`);
        return await generateWithOllama(prompt);
      }
    } catch (error) {
      logger.error(`LLM Generation Error [${useGroq ? 'Groq' : 'Ollama'}]: ${error.message}`);

      if (!useGroq && error.code === 'ECONNREFUSED') {
        throw new Error(`Ollama unreachable. Run: ollama serve && ollama pull qwen2.5:3b`);
      }

      throw error;
    }
  }
};

// Backwards-compat alias — allows existing `import { ollama }` to keep working
export const ollama = llm;
