export interface APIConfig {
  name: string
  endpoint: string
  headers: Record<string, string>
  requestFormat: (content: string) => any
  responseParser: (response: any) => SingleAPIResult
  enabled: boolean
}

export interface SingleAPIResult {
  probability: number
  confidence: 'low' | 'medium' | 'high'
  source: string
  error?: string
}

export interface MultiAPIDetectionResult {
  averageProbability: number
  confidence: 'low' | 'medium' | 'high'
  individualResults: SingleAPIResult[]
  reasoning: string
  highlightedPhrases: any[]
}

// API configurations
export const API_CONFIGS: Record<string, APIConfig> = {
  zerogpt: {
    name: 'ZeroGPT',
    endpoint: 'https://api.zerogpt.com/api/detect/detectText',
    headers: {
      'Content-Type': 'application/json',
      'ApiKey': process.env.ZEROGPT_API_KEY || ''
    },
    requestFormat: (content: string) => ({
      input_text: content
    }),
    responseParser: (response: any) => ({
      probability: response.data?.fakePercentage || 0,
      confidence: response.data?.fakePercentage > 70 ? 'high' : response.data?.fakePercentage > 40 ? 'medium' : 'low',
      source: 'ZeroGPT'
    }),
    enabled: !!process.env.ZEROGPT_API_KEY
  },
  gptzero: {
    name: 'GPTZero',
    endpoint: 'https://api.gptzero.me/v2/predict/text',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.GPTZERO_API_KEY || ''
    },
    requestFormat: (content: string) => ({
      document: content
    }),
    responseParser: (response: any) => ({
      probability: (response.documents?.[0]?.completely_generated_prob || 0) * 100,
      confidence: response.documents?.[0]?.completely_generated_prob > 0.7 ? 'high' : response.documents?.[0]?.completely_generated_prob > 0.4 ? 'medium' : 'low',
      source: 'GPTZero'
    }),
    enabled: !!process.env.GPTZERO_API_KEY
  },
  sapling: {
    name: 'Sapling',
    endpoint: 'https://api.sapling.ai/api/v1/aidetect',
    headers: {
      'Content-Type': 'application/json'
    },
    requestFormat: (content: string) => ({
      key: process.env.SAPLING_API_KEY || '',
      text: content
    }),
    responseParser: (response: any) => ({
      probability: (response.score || 0) * 100,
      confidence: response.score > 0.7 ? 'high' : response.score > 0.4 ? 'medium' : 'low',
      source: 'Sapling'
    }),
    enabled: !!process.env.SAPLING_API_KEY
  }
}

async function callSingleAPI(config: APIConfig, content: string): Promise<SingleAPIResult> {
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(config.requestFormat(content))
    })

    if (!response.ok) {
      throw new Error(`${config.name} API error: ${response.statusText}`)
    }

    const data = await response.json()
    return config.responseParser(data)
  } catch (error) {
    console.error(`${config.name} API error:`, error)
    return {
      probability: 0,
      confidence: 'low',
      source: config.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function analyzeWithMultiAPI(content: string): Promise<MultiAPIDetectionResult> {
  const enabledAPIs = Object.values(API_CONFIGS).filter(api => api.enabled)
  
  if (enabledAPIs.length === 0) {
    throw new Error('No AI detection APIs are configured')
  }

  // Call all enabled APIs in parallel
  const results = await Promise.all(
    enabledAPIs.map(api => callSingleAPI(api, content))
  )

  // Filter out failed results
  const successfulResults = results.filter(result => !result.error)
  
  if (successfulResults.length === 0) {
    throw new Error('All AI detection APIs failed')
  }

  // Calculate average probability
  const averageProbability = successfulResults.reduce((sum, result) => sum + result.probability, 0) / successfulResults.length
  
  // Determine overall confidence
  const confidence = averageProbability > 70 ? 'high' : averageProbability > 40 ? 'medium' : 'low'
  
  // Generate reasoning
  const reasoning = `Analysis completed using ${successfulResults.length} AI detection service(s): ${successfulResults.map(r => r.source).join(', ')}. Average AI probability: ${averageProbability.toFixed(1)}%`

  return {
    averageProbability,
    confidence,
    individualResults: results,
    reasoning,
    highlightedPhrases: [] // This would need more sophisticated implementation
  }
}