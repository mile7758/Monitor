# Monitor Demo

Monitor Demo 是一个前端监控 SDK 示例项目，基于 React + Vite 构建。项目实现了从错误采集、性能采集、用户行为追踪到数据批量上报的完整链路，并提供会话录屏（Session Replay）与 React ErrorBoundary 集成能力。

你可以把它理解为一个可直接二次开发的浏览器监控基础框架：

- 面向前端应用的轻量监控 SDK
- 事件总线驱动的模块化架构
- 内置 Demo 页面，便于快速验证各类监控场景

## 项目结构

```text
.
├── public/
├── src/
│   ├── advanced/
│   │   └── sessionReplay.js        # 会话录屏采集与上报
│   ├── collector/
│   │   ├── behaviorCollector.js    # 用户行为采集（点击、路由、网络、console）
│   │   ├── errorCollector.js       # 错误采集（JS、Promise、资源加载）
│   │   └── performanceCollector.js # 性能采集（Web Vitals、资源、长任务、内存）
│   ├── core/
│   │   ├── config.js               # 默认配置
│   │   ├── eventBus.js             # 事件总线
│   │   └── index.js                # 核心初始化与会话/用户管理
│   ├── framework/
│   │   └── reactIntegration.js     # React ErrorBoundary 集成
│   ├── reporter/
│   │   └── dataReporter.js         # 批量上报、重试、降级策略
│   ├── index.js                    # SDK 主入口
│   ├── App.tsx                     # 监控功能测试页面
│   └── main.tsx                    # Demo 启动与 SDK 初始化
├── test-server.js                  # 本地上报接收服务（Express）
├── vite.config.ts
├── package.json
└── README.md
```

## 技术栈

- 前端框架: React 19.2.0
- 构建工具: Vite 7.3.1
- 类型系统: TypeScript 5.9.3（项目中同时包含 TS 与 JS 文件）
- 代码规范: ESLint 9
- 监控扩展:
  - web-vitals（可选，用于核心性能指标）
  - rrweb（可选，用于会话录屏）
- 本地测试服务: Express + CORS

## 实现功能

### 1. 错误监控

- JavaScript 运行时错误采集
- Promise 未处理拒绝采集
- 资源加载失败采集（script/link/img）
- React ErrorBoundary 组件错误采集
- 手动错误上报接口（reportError）

### 2. 性能监控

- Web Vitals 指标采集（CLS/FCP/FID/LCP/TTFB）
- 资源加载时序采集（Resource Timing）
- Long Task 卡顿采集
- JS 堆内存指标采集
- 自定义性能上报接口（reportPerformance）

### 3. 用户行为监控

- 点击行为采集（DOM 摘要、坐标等）
- 路由变化采集（pushState/replaceState/popstate/hashchange）
- 网络请求采集（XHR / Fetch）
- 控制台输出采集（可配置开关）
- 面包屑队列管理（最大数量限制、清空能力）

### 4. 数据上报与可靠性

- 批量队列上报（batchSize / batchInterval）
- 最大队列保护（maxQueueSize）
- 多种上报通道：fetch / beacon / image
- 上报失败自动重试（指数退避）
- 上报上下文补充（会话、用户、设备、页面环境）

### 5. 高级能力

- 异常前后触发式会话录屏（Session Replay）
- 录屏采样率控制
- 错误发生后自动停止录制并上报

### 6. Demo 验证能力

- 运行时错误、Promise 错误、组件错误一键测试
- 网络请求与行为追踪测试
- 手动上报与调试日志验证

## 快速开始

### 前置要求

- Node.js >= 18（建议使用最新 LTS）
- pnpm

### 安装依赖

```bash
pnpm install
```

如需完整体验本地接收服务和高级采集能力，可额外安装可选依赖：

```bash
pnpm add web-vitals rrweb
pnpm add -D express cors
```

### 启动前端开发服务

```bash
pnpm dev
```

默认访问地址（Vite）：

- http://localhost:5173

### 启动本地上报接收服务（可选）

```bash
node test-server.js
```

服务默认地址：

- http://localhost:3001

可用端点：

- POST /api/report：接收错误、性能、行为数据
- POST /api/session-replay：接收录屏数据
- GET /api/data：查看已接收数据
- DELETE /api/clear：清空接收数据

## 构建与预览

### 构建生产版本

```bash
pnpm build
```

### 本地预览生产版本

```bash
pnpm preview
```

## SDK 初始化示例

```ts
import { init } from 'monitor-demo'

const monitor = init({
  appKey: 'test-app-key',
  serverUrl: 'http://localhost:3001',
  debug: true,
  framework: {
    react: true,
  },
  advanced: {
    enableSessionReplay: true,
    sessionReplaySampleRate: 1,
  },
  reporter: {
    reportMethod: 'fetch',
    debug: true,
  },
})

monitor.setUserId('user-001')
monitor.setUserData({ role: 'tester' })
```

## 项目难点

### 1. 采集链路的模块解耦

- 通过事件总线连接核心层、采集层和上报层
- 在低耦合前提下保证事件上下文可追踪

### 2. 浏览器 API 劫持与恢复

- 对 fetch/XHR/history/console 的增强需要兼顾兼容性
- 销毁阶段要正确恢复原始方法，避免污染业务环境

### 3. 可靠上报策略

- 在页面卸载、弱网和跨域场景下保证可达率
- 结合队列、批量、重试与通道降级，平衡实时性和开销

### 4. 会话录屏的数据体积控制

- 错误触发式录制，减少冗余采集
- 事件条数上限与自动停止机制控制上报成本

## 后续可扩展方向

- 引入告警平台（飞书/企业微信/邮件）
- 支持 sourcemap 解析还原线上堆栈
- 增加白屏检测与首屏体验指标
- 增加插件体系，支持业务自定义采集器
