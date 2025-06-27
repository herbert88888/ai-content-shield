import { NextRequest, NextResponse } from 'next/server'
import type { AnalysisResult, AnalysisRequest, APIResponse } from '@/types'
import { analyzeAIContent } from '@/lib/services/aiDetection'
import { checkOriginality } from '@/lib/services/plagiarismCheck'
import { assessCopyrightRisk } from '@/lib/services/copyrightCheck'
import { assessSEORisk } from '@/lib/services/seoAssessment'
import { generateAIDisclosure } from '@/lib/services/disclosureGenerator'

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Content is required and must be a string'
      }, { status: 400 })
    }

    if (body.content.length > 5000) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Content must be 5000 characters or less'
      }, { status: 400 })
    }

    if (body.content.trim().length < 10) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Content must be at least 10 characters long for meaningful analysis'
      }, { status: 400 })
    }

    // Get current detection strategy configuration
    const useMultiAPI = process.env.USE_MULTI_API === 'true'
    
    // Run all analyses in parallel for better performance
    const [aiDetection, originality, copyrightRisk, seoAssessment] = await Promise.allSettled([
      analyzeAIContent(body.content, useMultiAPI),
      checkOriginality(body.content),
      assessCopyrightRisk(body.content),
      assessSEORisk(body.content)
    ])

    // Handle any failed analyses
    const aiResult = aiDetection.status === 'fulfilled' ? aiDetection.value : {
      probability: 0,
      confidence: 'low' as const,
      highlightedPhrases: [],
      reasoning: 'AI detection service unavailable'
    }

    const originalityResult = originality.status === 'fulfilled' ? originality.value : {
      originalityScore: 100,
      isPlagiarized: false,
      matchedSources: [],
      highlightedMatches: []
    }

    const copyrightResult = copyrightRisk.status === 'fulfilled' ? copyrightRisk.value : {
      riskLevel: 'low' as const,
      detectedContent: [],
      recommendations: []
    }

    const seoResult = seoAssessment.status === 'fulfilled' ? seoAssessment.value : {
      score: 3,
      eeatViolations: [],
      recommendations: [],
      riskFactors: []
    }

    // Generate disclosure statement based on AI detection results
    const disclosureStatement = await generateAIDisclosure(
      body.content,
      aiResult.probability,
      body.contentType || 'general'
    )

    // Calculate overall risk level
    const overallRisk = calculateOverallRisk(aiResult, originalityResult, copyrightResult, seoResult)

    const analysisResult: AnalysisResult = {
      aiDetection: aiResult,
      originality: originalityResult,
      copyrightRisk: copyrightResult,
      seoAssessment: seoResult,
      disclosureStatement,
      overallRisk,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json<APIResponse<AnalysisResult>>({
      success: true,
      data: analysisResult,
      message: 'Analysis completed successfully'
    })

  } catch (error) {
    console.error('Analysis API Error:', error)
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'Internal server error during analysis'
    }, { status: 500 })
  }
}

function calculateOverallRisk(
  aiDetection: any,
  originality: any,
  copyrightRisk: any,
  seoAssessment: any
): 'low' | 'medium' | 'high' {
  let riskScore = 0

  // AI detection risk (0-3 points)
  if (aiDetection.probability > 80) riskScore += 3
  else if (aiDetection.probability > 50) riskScore += 2
  else if (aiDetection.probability > 20) riskScore += 1

  // Originality risk (0-3 points)
  if (originality.originalityScore < 60) riskScore += 3
  else if (originality.originalityScore < 80) riskScore += 2
  else if (originality.originalityScore < 95) riskScore += 1

  // Copyright risk (0-3 points)
  if (copyrightRisk.riskLevel === 'high') riskScore += 3
  else if (copyrightRisk.riskLevel === 'medium') riskScore += 2
  else if (copyrightRisk.riskLevel === 'low') riskScore += 0

  // SEO risk (0-3 points)
  if (seoAssessment.score <= 2) riskScore += 3
  else if (seoAssessment.score <= 3) riskScore += 2
  else if (seoAssessment.score <= 4) riskScore += 1

  // Calculate overall risk
  if (riskScore >= 8) return 'high'
  if (riskScore >= 4) return 'medium'
  return 'low'
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Content Shield Analysis API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze',
      aiDetection: 'POST /api/ai-detection',
      originality: 'POST /api/originality',
      copyrightRisk: 'POST /api/copyright-risk',
      seoAssessment: 'POST /api/seo-assessment',
      generateDisclosure: 'POST /api/generate-disclosure'
    }
  })
}