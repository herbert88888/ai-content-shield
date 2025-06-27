export interface AIDetectionResult {
  probability: number // 0-100
  confidence: 'low' | 'medium' | 'high'
  highlightedPhrases: HighlightedPhrase[]
  reasoning: string
}

export interface HighlightedPhrase {
  text: string
  startIndex: number
  endIndex: number
  reason: string
}

export interface OriginalityResult {
  originalityScore: number // 0-100
  isPlagiarized: boolean
  matchedSources: MatchedSource[]
  highlightedMatches: HighlightedPhrase[]
}

export interface MatchedSource {
  url: string
  title: string
  matchPercentage: number
  snippet: string
}

export interface CopyrightRisk {
  riskLevel: 'low' | 'medium' | 'high'
  detectedContent: DetectedContent[]
  recommendations: string[]
}

export interface DetectedContent {
  type: 'lyrics' | 'script' | 'quote' | 'trademark' | 'other'
  content: string
  confidence: number
  source?: string
}

export interface SEOAssessment {
  score: number // 1-5
  eeatViolations: EEATViolation[]
  recommendations: string[]
  riskFactors: string[]
}

export interface EEATViolation {
  type: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness'
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface DisclosureStatement {
  statement: string
  style: 'blog' | 'academic' | 'marketing'
  placement: 'beginning' | 'end' | 'both'
  alternatives: string[]
}

export interface AnalysisResult {
  aiDetection: AIDetectionResult
  originality: OriginalityResult
  copyrightRisk: CopyrightRisk
  seoAssessment: SEOAssessment
  disclosureStatement: DisclosureStatement
  overallRisk: 'low' | 'medium' | 'high'
  timestamp: string
}

export interface AnalysisRequest {
  content: string
  contentType?: 'blog' | 'academic' | 'marketing' | 'general'
  language?: string
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}