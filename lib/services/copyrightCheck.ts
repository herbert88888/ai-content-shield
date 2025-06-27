import type { CopyrightRisk } from '@/types'

export async function assessCopyrightRisk(content: string): Promise<CopyrightRisk> {
  const detectedContent: any[] = []
  const recommendations: string[] = []
  
  // Check for song lyrics patterns
  const lyricsPatterns = [
    /\[verse\s*\d*\]/i,
    /\[chorus\]/i,
    /\[bridge\]/i,
    /\[outro\]/i,
    /\[intro\]/i,
    /\(repeat\s*\d*x?\)/i
  ]
  
  lyricsPatterns.forEach(pattern => {
    const match = content.match(pattern)
    if (match) {
      detectedContent.push({
        type: 'lyrics',
        content: match[0],
        confidence: 0.8,
        source: 'Pattern detection'
      })
    }
  })
  
  // Check for script/screenplay patterns
  const scriptPatterns = [
    /^[A-Z\s]+:\s*$/m,
    /\(.*\)$/m,
    /FADE IN:/i,
    /FADE OUT:/i,
    /INT\.|EXT\./i
  ]
  
  scriptPatterns.forEach(pattern => {
    const match = content.match(pattern)
    if (match) {
      detectedContent.push({
        type: 'script',
        content: match[0],
        confidence: 0.7,
        source: 'Pattern detection'
      })
    }
  })
  
  // Check for famous quotes (simplified)
  const famousQuotes = [
    'to be or not to be',
    'i have a dream',
    'ask not what your country',
    'four score and seven years ago',
    'we hold these truths to be self-evident'
  ]
  
  famousQuotes.forEach(quote => {
    if (content.toLowerCase().includes(quote)) {
      detectedContent.push({
        type: 'quote',
        content: quote,
        confidence: 0.9,
        source: 'Famous quotes database'
      })
    }
  })
  
  // Check for trademark symbols
  const trademarkPatterns = [
    /\b\w+™/g,
    /\b\w+®/g,
    /\b\w+©/g
  ]
  
  trademarkPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(match => {
        detectedContent.push({
          type: 'trademark',
          content: match,
          confidence: 0.6,
          source: 'Trademark symbol detection'
        })
      })
    }
  })
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  
  if (detectedContent.length === 0) {
    riskLevel = 'low'
    recommendations.push('No obvious copyright issues detected.')
  } else if (detectedContent.length <= 2) {
    riskLevel = 'medium'
    recommendations.push('Some potentially copyrighted content detected. Review and verify usage rights.')
  } else {
    riskLevel = 'high'
    recommendations.push('Multiple copyright concerns detected. Strongly recommend legal review.')
  }
  
  // Add general recommendations
  if (detectedContent.some(item => item.type === 'lyrics')) {
    recommendations.push('Song lyrics detected. Ensure you have proper licensing for music content.')
  }
  
  if (detectedContent.some(item => item.type === 'quote')) {
    recommendations.push('Famous quotes detected. Consider adding proper attribution.')
  }
  
  if (detectedContent.some(item => item.type === 'trademark')) {
    recommendations.push('Trademark symbols detected. Verify proper usage rights for branded content.')
  }
  
  return {
    riskLevel,
    detectedContent,
    recommendations
  }
}