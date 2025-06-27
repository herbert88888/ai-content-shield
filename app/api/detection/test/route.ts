import { NextRequest, NextResponse } from 'next/server'
import { testAPIConnection } from '@/lib/services/aiDetection'

export async function POST(request: NextRequest) {
  try {
    const { apiName } = await request.json()
    
    if (!apiName || typeof apiName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid API name' },
        { status: 400 }
      )
    }
    
    const result = await testAPIConnection(apiName)
    
    return NextResponse.json({
      success: result.success,
      api: apiName,
      responseTime: result.responseTime,
      error: result.error
    })
  } catch (error) {
    console.error('Error testing API connection:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test API connection',
        responseTime: 0
      },
      { status: 500 }
    )
  }
}