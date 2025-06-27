# AI Content Shield

智能内容检测与风险评估平台

## 项目简介

AI Content Shield 是一个综合性的内容分析平台，专为现代内容创作者、编辑和营销团队设计。该平台集成了多种先进的AI技术，提供全方位的内容质量评估和风险管控功能。

## 核心功能

### 🤖 AI内容检测
- **多API集成**: 支持 OpenAI、ZeroGPT、GPTZero、Sapling、HuggingFace 等多个检测引擎
- **智能策略**: 提供保守、激进、快速三种检测策略
- **高精度分析**: 综合多个API结果，提供更准确的AI内容识别
- **详细报告**: 提供概率分析、置信度评估和具体原因说明

### 📝 原创性检查
- **抄袭检测**: 集成 CopyLeaks API 进行全网内容比对
- **相似度分析**: 精确识别重复和相似内容片段
- **来源追踪**: 提供匹配内容的具体来源信息
- **原创性评分**: 量化内容的原创程度

### ⚖️ 版权风险评估
- **智能识别**: 自动检测歌词、剧本、著名引用等受版权保护的内容
- **商标检测**: 识别可能涉及商标侵权的内容
- **风险分级**: 提供低、中、高三级风险评估
- **法律建议**: 针对不同风险级别提供相应的法律建议

### 🔍 SEO风险分析
- **E-E-A-T评估**: 基于Google的经验、专业性、权威性、可信度标准
- **内容质量分析**: 评估内容的SEO友好程度
- **优化建议**: 提供具体的SEO改进建议
- **风险预警**: 识别可能影响搜索排名的内容问题

### 📋 披露声明生成
- **智能生成**: 基于内容分析结果自动生成合规的AI披露声明
- **多种样式**: 提供正式、友好、简洁等多种声明风格
- **位置建议**: 推荐最佳的声明放置位置
- **自定义选项**: 支持根据品牌需求定制声明内容

## 技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + 自定义组件
- **状态管理**: React Hooks
- **图标**: Lucide React

### 后端技术栈
- **API路由**: Next.js API Routes
- **外部集成**: 
  - OpenAI GPT API
  - CopyLeaks API
  - ZeroGPT API
  - GPTZero API
  - Sapling API
  - HuggingFace API

### 核心特性
- **响应式设计**: 完美适配桌面和移动设备
- **实时分析**: 快速的内容处理和结果展示
- **批量处理**: 支持大量文本的批量分析
- **结果导出**: 支持JSON、PDF等多种格式导出
- **API友好**: 提供完整的REST API接口

## 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/herbert88888/ai-content-shield.git
cd ai-content-shield
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加必要的API密钥：
```env
# OpenAI API (用于AI检测和披露声明生成)
OPENAI_API_KEY=your_openai_api_key

# CopyLeaks API (用于原创性检查)
COPYLEAKS_API_KEY=your_copyleaks_api_key
COPYLEAKS_EMAIL=your_copyleaks_email

# 外部AI检测API (可选)
ZEROGPT_API_KEY=your_zerogpt_api_key
GPTZERO_API_KEY=your_gptzero_api_key
SAPLING_API_KEY=your_sapling_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用指南

### 基础分析
1. 在主页面的文本框中输入要分析的内容
2. 点击"开始分析"按钮
3. 等待分析完成，查看详细结果

### 多API检测
1. 访问"多API演示"页面
2. 选择检测策略（保守/激进/快速）
3. 输入内容并开始检测
4. 查看各个API的检测结果对比

### API使用示例

#### 内容分析API
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: '要分析的文本内容',
    options: {
      includeAIDetection: true,
      includeOriginality: true,
      includeCopyright: true,
      includeSEO: true,
      includeDisclosure: true
    }
  })
});

const result = await response.json();
```

#### 多API检测
```javascript
const response = await fetch('/api/detection/strategy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: '要检测的文本内容',
    strategy: 'balanced' // 'conservative', 'aggressive', 'fast'
  })
});

const result = await response.json();
```

## 项目结构

```
ai-content-shield/
├── app/                          # Next.js App Router
│   ├── api/                      # API路由
│   │   ├── analyze/              # 主要分析API
│   │   └── detection/            # AI检测相关API
│   ├── multi-api-demo/           # 多API演示页面
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   ├── AnalysisResults.tsx       # 分析结果展示
│   └── ApiStatusPanel.tsx        # API状态面板
├── lib/                          # 核心库文件
│   ├── services/                 # 业务服务
│   │   ├── aiDetection.ts        # AI检测服务
│   │   ├── plagiarismCheck.ts    # 抄袭检查服务
│   │   ├── copyrightCheck.ts     # 版权检查服务
│   │   ├── seoAssessment.ts      # SEO评估服务
│   │   ├── disclosureGenerator.ts # 披露声明生成
│   │   └── multiApiDetection.ts  # 多API检测
│   ├── types/                    # TypeScript类型定义
│   ├── api.ts                    # API客户端
│   └── utils.ts                  # 工具函数
├── types/                        # 全局类型定义
└── public/                       # 静态资源
```

## 开发指南

### 添加新的检测API

1. 在 `lib/services/multiApiDetection.ts` 中添加新的API配置
2. 实现API调用逻辑
3. 更新类型定义
4. 在UI中添加API状态显示

### 自定义分析策略

1. 在 `lib/services/` 目录下创建新的服务文件
2. 实现分析逻辑
3. 在主分析API中集成新服务
4. 更新前端展示组件

### 样式定制

项目使用 Tailwind CSS，可以通过以下方式定制样式：

1. 修改 `tailwind.config.js` 配置
2. 在 `app/globals.css` 中添加自定义CSS
3. 使用 CSS变量进行主题定制

## 注意事项

### API密钥安全
- 所有API密钥都应存储在环境变量中
- 不要将密钥提交到版本控制系统
- 在生产环境中使用安全的密钥管理服务

### 性能优化
- 大文本分析可能需要较长时间，建议添加进度指示器
- 考虑实现结果缓存以提高响应速度
- 对于批量处理，建议使用队列系统

### 法律合规
- 确保遵守各地区的AI内容披露法规
- 版权检测结果仅供参考，重要决策请咨询法律专家
- 定期更新检测算法以保持准确性

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 支持

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

- 提交 [GitHub Issue](https://github.com/herbert88888/ai-content-shield/issues)
- 查看 [文档](https://github.com/herbert88888/ai-content-shield/wiki)
- 联系开发团队

## 更新日志

### v1.0.0 (2024-01-XX)
- 初始版本发布
- 实现AI内容检测功能
- 添加原创性检查
- 集成版权风险评估
- 实现SEO分析功能
- 添加披露声明生成
- 支持多API检测策略

---

**AI Content Shield** - 让内容创作更安全、更合规、更优质！