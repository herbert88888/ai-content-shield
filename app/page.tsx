'use client'

import { useState } from 'react'
import { Shield, FileText, AlertTriangle, CheckCircle, Copy, Download } from 'lucide-react'
import AnalysisResults from '@/components/AnalysisResults'
import { analyzeContent } from '@/lib/api'
import type { AnalysisResult } from '@/types'

export default function Home() {
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze')
      return
    }

    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters long for meaningful analysis')
      return
    }

    if (content.length > 5000) {
      setError('Content must be 5000 characters or less')
      return
    }

    setIsAnalyzing(true)
    setError('')
    
    try {
      const analysisResults = await analyzeContent(content)
      setResults(analysisResults)
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setContent('')
    setResults(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AIContentShield</h1>
              <p className="text-sm text-gray-600">AI Content Compliance & Transparency Checker</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          /* Input Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ensure Content Compliance & Transparency
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Analyze your content for AI generation patterns, plagiarism risks, copyright issues, 
                and get SEO-compliant disclosure recommendations.
              </p>
            </div>

            <div className="card mb-6">
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content to Analyze
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here (minimum 10 characters, up to 5,000 characters)..."
                  className="textarea-field h-64"
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {content.length}/5,000 characters (minimum: 10)
                  </span>
                  {content.length > 4500 ? (
                    <span className="text-sm text-amber-600">
                      Approaching character limit
                    </span>
                  ) : content.trim().length > 0 && content.trim().length < 10 ? (
                    <span className="text-sm text-red-600">
                      Need {10 - content.trim().length} more characters
                    </span>
                  ) : null}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !content.trim()}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
                
                {content && (
                  <button
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Detection</h3>
                <p className="text-sm text-gray-600">Identify AI-generated content patterns and likelihood scores</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Originality Check</h3>
                <p className="text-sm text-gray-600">Scan for plagiarism and content originality issues</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Copyright Risk</h3>
                <p className="text-sm text-gray-600">Detect potential copyright conflicts and protected content</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">SEO Compliance</h3>
                <p className="text-sm text-gray-600">Generate disclosure statements and assess SEO risks</p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Analyze New Content
              </button>
            </div>
            
            <AnalysisResults results={results} originalContent={content} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 AIContentShield. Built for content transparency and compliance.</p>
            <p className="mt-2">
              <span className="font-medium">Disclaimer:</span> This tool provides guidance only. 
              Always verify compliance with your specific requirements and regulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}