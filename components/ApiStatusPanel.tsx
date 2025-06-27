'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, Settings, Zap } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface APIStatus {
  name: string
  enabled: boolean
  configured: boolean
}

interface APITestResult {
  success: boolean
  responseTime: number
  error?: string
}

interface DetectionStrategy {
  strategy: 'multi-api' | 'openai' | 'fallback'
  availableAPIs: string[]
  recommendedStrategy: string
}

interface ApiStatusPanelProps {
  onStrategyChange?: (useMultiAPI: boolean) => void
}

export function ApiStatusPanel({ onStrategyChange }: ApiStatusPanelProps) {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([])
  const [testResults, setTestResults] = useState<Record<string, APITestResult>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [strategy, setStrategy] = useState<DetectionStrategy | null>(null)
  const [useMultiAPI, setUseMultiAPI] = useState(false)
  const [loading, setLoading] = useState(true)

  // 获取API状态
  const fetchAPIStatus = async () => {
    try {
      const response = await fetch('/api/detection/status')
      if (response.ok) {
        const data = await response.json()
        setApiStatuses(data.apiStatuses || [])
        setStrategy(data.strategy || null)
        setUseMultiAPI(data.strategy?.strategy === 'multi-api')
      }
    } catch (error) {
      console.error('Failed to fetch API status:', error)
    } finally {
      setLoading(false)
    }
  }

  // 测试单个API
  const testAPI = async (apiName: string) => {
    setTesting(prev => ({ ...prev, [apiName]: true }))
    
    try {
      const response = await fetch('/api/detection/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiName })
      })
      
      if (response.ok) {
        const result = await response.json()
        setTestResults(prev => ({ ...prev, [apiName]: result }))
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          [apiName]: { 
            success: false, 
            responseTime: 0, 
            error: 'Test failed' 
          } 
        }))
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [apiName]: { 
          success: false, 
          responseTime: 0, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }))
    } finally {
      setTesting(prev => ({ ...prev, [apiName]: false }))
    }
  }

  // 切换检测策略
  const handleStrategyToggle = async (enabled: boolean) => {
    setUseMultiAPI(enabled)
    onStrategyChange?.(enabled)
    
    try {
      await fetch('/api/detection/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useMultiAPI: enabled })
      })
      
      // 重新获取策略信息
      await fetchAPIStatus()
    } catch (error) {
      console.error('Failed to update strategy:', error)
    }
  }

  useEffect(() => {
    fetchAPIStatus()
  }, [])

  const getStatusIcon = (api: APIStatus) => {
    if (!api.configured) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
    return api.enabled ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-gray-400" />
  }

  const getStatusBadge = (api: APIStatus) => {
    if (!api.configured) {
      return <Badge variant="outline" className="text-yellow-600">未配置</Badge>
    }
    return api.enabled ? 
      <Badge variant="default" className="bg-green-100 text-green-800">已启用</Badge> : 
      <Badge variant="secondary">已禁用</Badge>
  }

  const getTestResultBadge = (result?: APITestResult) => {
    if (!result) return null
    
    if (result.success) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          ✓ {result.responseTime}ms
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          ✗ {result.error || '失败'}
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">加载API状态...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 检测策略配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            检测策略配置
          </CardTitle>
          <CardDescription>
            选择AI内容检测策略以获得最佳准确性
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="multi-api"
              checked={useMultiAPI}
              onCheckedChange={handleStrategyToggle}
            />
            <Label htmlFor="multi-api" className="text-sm font-medium">
              启用多API组合检测
            </Label>
          </div>
          
          {strategy && (
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>当前策略:</strong> {strategy.recommendedStrategy}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* API状态面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              外部API状态
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAPIStatus}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
          </CardTitle>
          <CardDescription>
            查看和测试外部AI检测API的连接状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiStatuses.map((api, index) => (
              <div key={api.name}>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(api)}
                    <div>
                      <h4 className="font-medium">{api.name}</h4>
                      <p className="text-sm text-gray-500">
                        {api.name === 'ZeroGPT' && '免费API，无需配置密钥'}
                        {api.name === 'GPTZero' && '专业AI检测，支持多种模型'}
                        {api.name === 'Sapling' && '高准确率AI检测服务'}
                        {api.name === 'HuggingFace' && '开源AI模型检测'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(api)}
                    {getTestResultBadge(testResults[api.name])}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAPI(api.name)}
                      disabled={testing[api.name] || !api.configured}
                      className="flex items-center gap-1"
                    >
                      {testing[api.name] ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        '测试'
                      )}
                    </Button>
                  </div>
                </div>
                
                {index < apiStatuses.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
          
          {apiStatuses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>未找到可用的外部API配置</p>
              <p className="text-sm">请检查环境变量配置</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 配置说明 */}
      <Card>
        <CardHeader>
          <CardTitle>配置说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>ZeroGPT:</strong> 完全免费，无需API密钥，自动启用</p>
            <p><strong>GPTZero:</strong> 需要API密钥，每月10,000字免费额度</p>
            <p><strong>Sapling:</strong> 需要API密钥，提供免费检测服务</p>
            <p><strong>HuggingFace:</strong> 需要API密钥，使用开源AI检测模型</p>
          </div>
          
          <Separator />
          
          <div className="text-sm text-gray-600">
            <p><strong>多API策略优势:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>通过多个API交叉验证提高检测准确性</li>
              <li>降低单一API失效的风险</li>
              <li>提供共识分数和可靠性评估</li>
              <li>自动权重调整和结果优化</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiStatusPanel