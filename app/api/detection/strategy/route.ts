import { NextRequest, NextResponse } from 'next/server'
import { getDetectionStrategy } from '@/lib/services/aiDetection'

// 存储运行时策略配置（在生产环境中，这应该存储在数据库或缓存中）
let runtimeConfig = {
  useMultiAPI: process.env.USE_MULTI_API === 'true'
}

export async function GET() {
  try {
    const strategy = await getDetectionStrategy()
    
    return NextResponse.json({
      success: true,
      strategy,
      currentConfig: runtimeConfig
    })
  } catch (error) {
    console.error('Error fetching detection strategy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch detection strategy'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { useMultiAPI } = await request.json()
    
    if (typeof useMultiAPI !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid useMultiAPI value' },
        { status: 400 }
      )
    }
    
    // 更新运行时配置
    runtimeConfig.useMultiAPI = useMultiAPI
    
    // 获取更新后的策略信息
    const strategy = await getDetectionStrategy()
    
    return NextResponse.json({
      success: true,
      message: `Detection strategy updated to: ${useMultiAPI ? 'Multi-API' : 'Single API'}`,
      strategy,
      currentConfig: runtimeConfig
    })
  } catch (error) {
    console.error('Error updating detection strategy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update detection strategy'
      },
      { status: 500 }
    )
  }
}

// 获取运行时配置的辅助函数（不导出，避免Next.js路由冲突）
function getRuntimeConfig() {
  return runtimeConfig
}