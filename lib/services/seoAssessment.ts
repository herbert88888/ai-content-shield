import type { SEOAssessment } from '@/types'

export async function assessSEORisk(content: string): Promise<SEOAssessment> {
  const eeatViolations: any[] = []
  const recommendations: string[] = []
  const riskFactors: string[] = []
  
  // Check for EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) issues
  
  // Experience indicators
  const experienceKeywords = [
    'i think', 'i believe', 'in my opinion', 'i guess',
    'probably', 'maybe', 'might be', 'could be'
  ]
  
  const experienceCount = experienceKeywords.reduce((count, keyword) => {
    return count + (content.toLowerCase().split(keyword).length - 1)
  }, 0)
  
  if (experienceCount > 3) {
    eeatViolations.push({
      type: 'experience',
      description: 'High use of uncertain language that may indicate lack of direct experience',
      severity: 'medium'
    })
    riskFactors.push('Excessive use of uncertain language')
  }
  
  // Expertise indicators
  const expertiseKeywords = [
    'according to research', 'studies show', 'experts say',
    'scientific evidence', 'peer-reviewed', 'clinical trials'
  ]
  
  const expertiseCount = expertiseKeywords.reduce((count, keyword) => {
    return count + (content.toLowerCase().split(keyword).length - 1)
  }, 0)
  
  if (expertiseCount === 0 && content.length > 500) {
    eeatViolations.push({
      type: 'expertise',
      description: 'Lack of references to authoritative sources or expert opinions',
      severity: 'medium'
    })
    riskFactors.push('No expert sources cited')
  }
  
  // Authoritativeness indicators
  const hasAuthorInfo = /author:|by:|written by:/i.test(content)
  const hasCredentials = /phd|md|professor|dr\.|certified|licensed/i.test(content)
  
  if (!hasAuthorInfo && content.length > 1000) {
    eeatViolations.push({
      type: 'authoritativeness',
      description: 'No clear author attribution found',
      severity: 'low'
    })
    riskFactors.push('Missing author information')
  }
  
  if (!hasCredentials && content.length > 1000) {
    eeatViolations.push({
      type: 'authoritativeness',
      description: 'No professional credentials mentioned',
      severity: 'low'
    })
  }
  
  // Trustworthiness indicators
  const hasDisclaimer = /disclaimer|not medical advice|consult.*professional/i.test(content)
  const hasSources = /source:|reference:|https?:\/\//i.test(content)
  const hasDateInfo = /\d{4}|updated|published|last modified/i.test(content)
  
  if (!hasDisclaimer && /medical|health|treatment|diagnosis/.test(content.toLowerCase())) {
    eeatViolations.push({
      type: 'trustworthiness',
      description: 'Medical content without appropriate disclaimers',
      severity: 'high'
    })
    riskFactors.push('Medical content without disclaimers')
  }
  
  if (!hasSources && content.length > 800) {
    eeatViolations.push({
      type: 'trustworthiness',
      description: 'Lack of verifiable sources or references',
      severity: 'medium'
    })
    riskFactors.push('No sources or references provided')
  }
  
  if (!hasDateInfo && content.length > 500) {
    eeatViolations.push({
      type: 'trustworthiness',
      description: 'No publication or update date information',
      severity: 'low'
    })
  }
  
  // Calculate overall score (1-5, where 5 is best)
  let score = 5
  eeatViolations.forEach(violation => {
    switch (violation.severity) {
      case 'high':
        score -= 1.5
        break
      case 'medium':
        score -= 1
        break
      case 'low':
        score -= 0.5
        break
    }
  })
  
  score = Math.max(1, Math.min(5, score))
  
  // Generate recommendations
  if (eeatViolations.length === 0) {
    recommendations.push('Content appears to meet EEAT guidelines well.')
  } else {
    recommendations.push('Consider addressing the following EEAT concerns:')
    
    if (eeatViolations.some(v => v.type === 'experience')) {
      recommendations.push('• Add more definitive statements based on direct experience or research')
    }
    
    if (eeatViolations.some(v => v.type === 'expertise')) {
      recommendations.push('• Include references to expert sources and authoritative research')
    }
    
    if (eeatViolations.some(v => v.type === 'authoritativeness')) {
      recommendations.push('• Add clear author attribution and professional credentials')
    }
    
    if (eeatViolations.some(v => v.type === 'trustworthiness')) {
      recommendations.push('• Include proper disclaimers, sources, and publication dates')
    }
  }
  
  // Additional general recommendations
  if (score < 3) {
    recommendations.push('• Consider having content reviewed by subject matter experts')
    recommendations.push('• Add more authoritative sources and references')
  }
  
  return {
    score: Math.round(score * 10) / 10,
    eeatViolations,
    recommendations,
    riskFactors
  }
}