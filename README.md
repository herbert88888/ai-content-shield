# AI Content Shield

一个全面的AI内容检测和分析系统，帮助识别AI生成的内容、检查原创性、评估版权风险和SEO合规性。

## 功能特性

### 🤖 AI内容检测
- 分析文本被AI生成的可能性
- 提供置信度评估和详细推理
- 高亮显示可疑的AI生成短语
- 支持多种内容类型（文章、博客、学术论文等）

### 📝 原创性检查
- 检测抄袭和重复内容
- 识别匹配的来源
- 提供原创性评分
- 高亮显示可疑段落

### ⚖️ 版权风险评估
- 识别潜在的版权侵权内容
- 检测歌词、引用和受保护材料
- 提供风险等级评估
- 给出合规建议

### 🔍 SEO风险分析
- 评估Google E-E-A-T（经验、专业性、权威性、可信度）合规性
- 识别可能影响搜索排名的风险因素
- 提供SEO优化建议
- 检测AI内容对SEO的潜在影响

### 📋 披露声明生成
- 根据AI检测结果自动生成披露声明
- 符合平台和法规要求
- 提供多种披露模板
- 建议最佳放置位置

## 技术架构

### 后端服务
- **AI检测服务** (`lib/services/aiDetection.ts`): 使用OpenAI API进行AI内容检测
- **抄袭检测服务** (`lib/services/plagiarismCheck.ts`): 集成CopyLeaks API检查原创性
- **版权检测服务** (`lib/services/copyrightCheck.ts`): 基于规则的版权风险评估
- **SEO评估服务** (`lib/services/seoAssessment.ts`): E-E-A-T合规性分析
- **披露生成器** (`lib/services/disclosureGenerator.ts`): 智能披露声明生成

### API接口
- **分析端点** (`app/api/analyze/route.ts`): 统一的内容分析API
- 支持POST请求，接收JSON格式的内容数据
- 返回完整的分析结果，包括所有检测维度

### 前端组件
- **分析结果组件** (`components/AnalysisResults.tsx`): 展示分析结果的React组件
- 响应式设计，支持移动端和桌面端
- 交互式结果展示，包括高亮显示和详细说明

## 安装和使用

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env.local` 文件并配置以下环境变量：

```env
# OpenAI API配置（用于AI检测和披露生成）
OPENAI_API_KEY=your_openai_api_key

# CopyLeaks API配置（用于抄袭检测）
COPYLEAKS_API_KEY=your_copyleaks_api_key
COPYLEAKS_EMAIL=your_copyleaks_email
```

### 启动开发服务器
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### API使用示例

#### 分析内容
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "要分析的文本内容",
    "contentType": "article"
  }'
```

#### 响应格式
```json
{
  "success": true,
  "data": {
    "aiDetection": {
      "probability": 75,
      "confidence": "high",
      "highlightedPhrases": [...],
      "reasoning": "检测到多个AI生成的特征..."
    },
    "originality": {
      "originalityScore": 85,
      "isPlagiarized": false,
      "matchedSources": [...]
    },
    "copyrightRisk": {
      "riskLevel": "low",
      "detectedContent": [...],
      "recommendations": [...]
    },
    "seoAssessment": {
      "score": 4.2,
      "eeatViolations": [...],
      "recommendations": [...]
    },
    "disclosureStatement": {
      "statement": "此内容使用AI工具协助创建...",
      "style": "blog",
      "placement": "end"
    },
    "overallRisk": "medium",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## 多API检测策略

系统支持多种AI检测API的组合使用，以提高检测准确性：

### 支持的API
- **OpenAI API**: 基础AI检测（需要API密钥）
- **GPTZero**: 专业AI检测服务
- **Sapling AI**: 高精度AI检测
- **ZeroGPT**: 免费AI检测服务

### 配置多API检测
在 `.env.local` 中设置：
```env
USE_MULTI_API=true
GPTZERO_API_KEY=your_key
SAPLING_API_KEY=your_key
```

### 检测策略
1. **单API模式**: 仅使用OpenAI API
2. **多API模式**: 并行调用多个API，计算平均置信度
3. **回退策略**: 主API失败时自动切换到备用API

## 部署

### Vercel部署
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### Docker部署
```bash
# 构建镜像
docker build -t ai-content-shield .

# 运行容器
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e COPYLEAKS_API_KEY=your_key \
  ai-content-shield
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过GitHub Issues联系我们。