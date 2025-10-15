// src/components/ai/AIProvider.js
import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const HUGGINGFACE_API_KEY = process.env.REACT_APP_HF_API_KEY;

// Simple AI client with fallback
export const generateAIResponse = async (prompt, options = {}) => {
  try {
    // Primary: OpenAI
    const openAIResp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: options.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      }
    );
    return openAIResp.data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.warn('OpenAI failed, trying OpenRouter...', err.message);

    try {
      // Fallback: OpenRouter
      const openRouterResp = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: options.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
        },
        { headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` } }
      );
      return openRouterResp.data?.choices?.[0]?.message?.content || '';
    } catch (err2) {
      console.warn('OpenRouter failed, trying HuggingFace...', err2.message);

      // Fallback: HuggingFace Inference
      try {
        const hfResp = await axios.post(
          'https://api-inference.huggingface.co/models/gpt2',
          { inputs: prompt },
          { headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` } }
        );
        if (Array.isArray(hfResp.data)) return hfResp.data[0]?.generated_text || '';
        return hfResp.data?.generated_text || '';
      } catch (err3) {
        console.error('All AI providers failed', err3.message);
        throw new Error('AI service unavailable');
      }
    }
  }
};
