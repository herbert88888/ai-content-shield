import axios from 'axios'
import type { AnalysisResult, AnalysisRequest, APIResponse } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  try {
    const request: AnalysisRequest = {
      content,
      contentType: 'general',
      language: 'en'
    }

    const response = await api.post<APIResponse<AnalysisResult>>('/analyze', request)
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Analysis failed')
    }

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Network error occurred')
    }
    throw error
  }
}

export async function checkAIDetection(content: string) {
  try {
    const response = await api.post('/ai-detection', { content })
    return response.data
  } catch (error) {
    console.error('AI Detection Error:', error)
    throw error
  }
}

export async function checkOriginality(content: string) {
  try {
    const response = await api.post('/originality', { content })
    return response.data
  } catch (error) {
    console.error('Originality Check Error:', error)
    throw error
  }
}

export async function assessCopyrightRisk(content: string) {
  try {
    const response = await api.post('/copyright-risk', { content })
    return response.data
  } catch (error) {
    console.error('Copyright Risk Error:', error)
    throw error
  }
}

export async function generateDisclosure(content: string, style: string = 'blog') {
  try {
    const response = await api.post('/generate-disclosure', { content, style })
    return response.data
  } catch (error) {
    console.error('Disclosure Generation Error:', error)
    throw error
  }
}

export async function assessSEO(content: string) {
  try {
    const response = await api.post('/seo-assessment', { content })
    return response.data
  } catch (error) {
    console.error('SEO Assessment Error:', error)
    throw error
  }
}