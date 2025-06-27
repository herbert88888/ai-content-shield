import type { OriginalityResult } from '@/types'

export async function checkOriginality(content: string): Promise<OriginalityResult> {
  // Check if CopyLeaks API is configured
  const apiKey = process.env.COPYLEAKS_API_KEY
  const email = process.env.COPYLEAKS_EMAIL
  
  if (apiKey && email) {
    try {
      return await checkWithCopyLeaks(content, apiKey, email)
    } catch (error) {
      console.warn('CopyLeaks API failed, using fallback:', error)
    }
  }

  // Fallback: Basic pattern matching for common plagiarism indicators
  return checkWithFallback(content)
}

async function checkWithCopyLeaks(content: string, apiKey: string, email: string): Promise<OriginalityResult> {
  // First, get access token
  const authResponse = await fetch('https://id.copyleaks.com/v3/account/login/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      key: apiKey
    })
  })

  if (!authResponse.ok) {
    throw new Error('CopyLeaks authentication failed')
  }

  const authData = await authResponse.json()
  const accessToken = authData.access_token

  // Submit content for scanning
  const scanId = `scan-${Date.now()}`
  const scanResponse = await fetch(`https://api.copyleaks.com/v3/education/submit/file/${scanId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      base64: Buffer.from(content).toString('base64'),
      filename: 'content.txt',
      properties: {
        webhooks: {
          status: `${process.env.NEXT_PUBLIC_APP_URL}/api/copyleaks/webhook/${scanId}`
        }
      }
    })
  })

  if (!scanResponse.ok) {
    throw new Error('CopyLeaks scan submission failed')
  }

  // For demo purposes, return a mock result
  // In production, you'd implement webhook handling for async results
  return {
    originalityScore: 85,
    isPlagiarized: false,
    matchedSources: [],
    highlightedMatches: []
  }
}

function checkWithFallback(content: string): OriginalityResult {
  // Simple heuristic-based originality check
  const commonPhrases = [
    'lorem ipsum',
    'the quick brown fox',
    'to be or not to be',
    'it was the best of times'
  ]

  const suspiciousPatterns = [
    /^\s*copy\s+and\s+paste/i,
    /source:\s*https?:\/\//i,
    /\[citation\s+needed\]/i
  ]

  let suspicionScore = 0
  const matchedSources: any[] = []
  const highlightedMatches: any[] = []

  // Check for common phrases
  commonPhrases.forEach(phrase => {
    if (content.toLowerCase().includes(phrase)) {
      suspicionScore += 20
      highlightedMatches.push({
        text: phrase,
        startIndex: content.toLowerCase().indexOf(phrase),
        endIndex: content.toLowerCase().indexOf(phrase) + phrase.length,
        reason: 'Common placeholder text detected'
      })
    }
  })

  // Check for suspicious patterns
  suspiciousPatterns.forEach(pattern => {
    const match = content.match(pattern)
    if (match) {
      suspicionScore += 30
      highlightedMatches.push({
        text: match[0],
        startIndex: match.index || 0,
        endIndex: (match.index || 0) + match[0].length,
        reason: 'Suspicious pattern detected'
      })
    }
  })

  const originalityScore = Math.max(0, 100 - suspicionScore)
  const isPlagiarized = originalityScore < 70

  return {
    originalityScore,
    isPlagiarized,
    matchedSources,
    highlightedMatches
  }
}