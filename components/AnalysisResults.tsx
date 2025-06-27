'use client'

import { useState } from 'react'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Download,
  Eye,
  EyeOff,
  TrendingUp,
  Search,
  Scale
} from 'lucide-react'
import type { AnalysisResult } from '@/types'

interface AnalysisResultsProps {
  results: AnalysisResult
  originalContent: string
}

export default function AnalysisResults({ results, originalContent }: AnalysisResultsProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getScoreColor = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Assessment</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(results.overallRisk)}`}>
            {results.overallRisk.toUpperCase()} RISK
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(100 - results.aiDetection.probability)}`}>
              {(100 - results.aiDetection.probability).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Human-like</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.originality.originalityScore)}`}>
              {results.originality.originalityScore}%
            </div>
            <div className="text-sm text-gray-600">Original</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(results.seoAssessment.score, 5)}`}>
              {results.seoAssessment.score}/5
            </div>
            <div className="text-sm text-gray-600">SEO Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              results.copyrightRisk.riskLevel === 'low' ? 'text-green-600' :
              results.copyrightRisk.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {results.copyrightRisk.riskLevel === 'low' ? '✓' : 
               results.copyrightRisk.riskLevel === 'medium' ? '⚠' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Copyright</div>
          </div>
        </div>
      </div>

      {/* AI Detection Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Detection Analysis</h3>
          </div>
          <button
            onClick={() => toggleSection('ai-detection')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.has('ai-detection') ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">AI Generation Probability</span>
            <span className={`text-lg font-bold ${getScoreColor(100 - results.aiDetection.probability)}`}>
              {results.aiDetection.probability.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                results.aiDetection.probability < 30 ? 'bg-green-500' :
                results.aiDetection.probability < 70 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${results.aiDetection.probability}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Confidence: <span className="font-medium">{results.aiDetection.confidence}</span>
          </div>
        </div>

        {expandedSections.has('ai-detection') && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Analysis Reasoning</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {results.aiDetection.reasoning}
              </p>
            </div>
            
            {results.aiDetection.highlightedPhrases.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Highlighted AI-like Phrases</h4>
                <div className="space-y-2">
                  {results.aiDetection.highlightedPhrases.map((phrase, index) => (
                    <div key={index} className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <div className="font-medium text-amber-800">"{phrase.text}"</div>
                      <div className="text-sm text-amber-700 mt-1">{phrase.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Originality Check */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Originality Check</h3>
          </div>
          <button
            onClick={() => toggleSection('originality')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.has('originality') ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Originality Score</span>
            <span className={`text-lg font-bold ${getScoreColor(results.originality.originalityScore)}`}>
              {results.originality.originalityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                results.originality.originalityScore >= 80 ? 'bg-green-500' :
                results.originality.originalityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${results.originality.originalityScore}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Status: <span className={`font-medium ${
              results.originality.isPlagiarized ? 'text-red-600' : 'text-green-600'
            }`}>
              {results.originality.isPlagiarized ? 'Potential plagiarism detected' : 'No plagiarism detected'}
            </span>
          </div>
        </div>

        {expandedSections.has('originality') && results.originality.matchedSources.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Matched Sources</h4>
            <div className="space-y-3">
              {results.originality.matchedSources.map((source, index) => (
                <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" 
                       className="font-medium text-red-800 hover:text-red-900 truncate">
                      {source.title}
                    </a>
                    <span className="text-sm font-medium text-red-600">
                      {source.matchPercentage}% match
                    </span>
                  </div>
                  <p className="text-sm text-red-700">{source.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copyright Risk */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Scale className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Copyright Risk Assessment</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(results.copyrightRisk.riskLevel)}`}>
            {results.copyrightRisk.riskLevel.toUpperCase()}
          </span>
        </div>
        
        {results.copyrightRisk.detectedContent.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Detected Protected Content</h4>
            <div className="space-y-2">
              {results.copyrightRisk.detectedContent.map((content, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-800 capitalize">{content.type}</span>
                    <span className="text-sm text-amber-600">{content.confidence}% confidence</span>
                  </div>
                  <div className="text-sm text-amber-700">"{content.content}"</div>
                  {content.source && (
                    <div className="text-xs text-amber-600 mt-1">Source: {content.source}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.copyrightRisk.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {results.copyrightRisk.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SEO Assessment */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">SEO Risk Assessment</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Score:</span>
            <span className={`text-lg font-bold ${getScoreColor(results.seoAssessment.score, 5)}`}>
              {results.seoAssessment.score}/5
            </span>
          </div>
        </div>
        
        {results.seoAssessment.eeatViolations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">E-E-A-T Violations</h4>
            <div className="space-y-2">
              {results.seoAssessment.eeatViolations.map((violation, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  violation.severity === 'high' ? 'bg-red-50 border-red-200' :
                  violation.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{violation.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      violation.severity === 'high' ? 'bg-red-100 text-red-700' :
                      violation.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {violation.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{violation.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.seoAssessment.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">SEO Recommendations</h4>
            <ul className="space-y-1">
              {results.seoAssessment.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* AI Disclosure Statement */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recommended AI Disclosure</h3>
          </div>
          <button
            onClick={() => copyToClipboard(results.disclosureStatement.statement, 'disclosure')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>{copiedSection === 'disclosure' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-4">
          <p className="text-sm text-indigo-900 leading-relaxed">
            {results.disclosureStatement.statement}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Style:</span>
            <span className="ml-2 capitalize">{results.disclosureStatement.style}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Recommended Placement:</span>
            <span className="ml-2 capitalize">{results.disclosureStatement.placement}</span>
          </div>
        </div>
        
        {results.disclosureStatement.alternatives.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Alternative Statements</h4>
            <div className="space-y-2">
              {results.disclosureStatement.alternatives.map((alt, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{alt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => copyToClipboard(JSON.stringify(results, null, 2), 'full-report')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>{copiedSection === 'full-report' ? 'Copied!' : 'Copy Full Report'}</span>
          </button>
          <button
            onClick={() => {
              const dataStr = JSON.stringify(results, null, 2)
              const dataBlob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = `ai-content-analysis-${new Date().toISOString().split('T')[0]}.json`
              link.click()
              URL.revokeObjectURL(url)
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </div>
  )
}