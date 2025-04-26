# Markwhen VS Code 扩展开发计划

## 当前架构分析

### 现有实现

1. 使用压缩的 JS 文件（timeline.html, calendar.html）
2. 通过 `scripts/copyAssets.js` 从 node_modules 复制到 assets/views/
3. 在 webview 中加载这些压缩文件
4. 使用 `@markwhen/view-client` 进行通信

### 存在的问题

1. 无法调试视图组件代码
2. 难以自定义样式和行为
3. 无法直接使用开源版本的特性
4. 更新依赖版本困难

### 新的发现

1. 当前使用的是压缩后的构建版本
2. 可以通过以下方式使用非压缩版本：
   - 直接使用 GitHub 上的源码
   - 使用开发构建版本
   - 修改构建配置生成非压缩版本

## 重构计划

### 1. 项目结构重组

```bash
mwv/
├── src/                      # 源代码
│   ├── commands/           # 命令处理器
│   │   ├── timeline.ts    # 时间线相关命令
│   │   ├── calendar.ts    # 日历相关命令
│   │   ├── task.ts        # 任务管理命令
│   │   └── time.ts        # 时间追踪命令
│   │
│   ├── providers/         # VS Code 提供者
│   │   ├── timelineProvider.ts
│   │   ├── calendarProvider.ts
│   │   └── taskProvider.ts
│   │
│   ├── utils/             # 工具函数
│   ├── extension.ts       # 扩展入口
│   │
│   ├── views/            # 视图层（webview 内容）
│   │   ├── timeline/     # 时间线视图
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── utils/
│   │   │
│   │   ├── calendar/     # 日历视图
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── utils/
│   │   │
│   │   ├── task/        # 任务管理视图
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── utils/
│   │   │
│   │   └── shared/      # 共享组件和工具
│   │       ├── components/
│   │       ├── hooks/
│   │       └── utils/
│   │
│   └── core/           # 核心业务逻辑
│       ├── parser/     # Markwhen 解析器集成
│       ├── model/      # 数据模型扩展
│       │   ├── task.ts # 任务管理扩展
│       │   └── time.ts # 时间追踪扩展
│       └── utils/      # 工具函数
│
├── media/              # 静态资源
├── scripts/           # 构建和开发脚本
├── docs/              # 文档
├── .github/           # GitHub 配置
├── package.json       # 项目配置
└── tsconfig.json      # TypeScript 配置
```

### 2. 架构说明

#### VS Code 扩展

- 处理 VS Code 特定的逻辑
- 管理命令注册和执行
- 提供视图和编辑器集成
- 处理文件系统操作
- 支持命令扩展和自定义

#### 视图层 (views)

- 负责 webview 内容和交互
- 支持多种视图模式
- 提供丰富的可视化功能
- 支持热重载和调试
- 运行在 VS Code webview 中
- 使用 `@markwhen/view-client` 进行通信

#### 核心层 (core)

- 集成 Markwhen 核心功能
- 扩展任务管理和时间追踪功能
- 提供工具函数支持
- 保持与上游项目的兼容性

### 3. 开发环境设置

1. 安装依赖

```bash
# 安装 Markwhen 相关依赖
npm install @markwhen/parser @markwhen/view-client

# 安装其他依赖
npm install
```

2. 设置开发环境

- 配置 VS Code 扩展开发环境
- 设置前端开发环境
- 配置构建和调试工具

### 4. 构建流程

1. 前端构建

- 使用 Vite 或 Webpack
- 支持开发和生产环境
- 配置 sourcemap
- 支持热重载

2. 扩展构建

- 使用 TypeScript 编译
- 打包前端资源
- 生成 VSIX 包

### 5. 调试方案

1. 前端调试

- 使用 Chrome DevTools
- 支持 sourcemap
- 支持热重载

2. 扩展调试

- 使用 VS Code 调试工具
- 支持断点调试
- 支持日志输出

### 6. 功能扩展

1. 任务管理

- 支持 Markdown 任务列表
- 提供任务状态追踪
- 支持任务优先级
- 提供任务统计

2. 时间追踪

- 记录任务时间
- 提供时间统计
- 支持时间报告
- 集成日历视图

3. 数据可视化

- 时间线视图
- 日历视图
- 任务看板
- 统计图表

## 实施步骤

### 第一阶段：基础设置

1. [ ] 创建项目结构
2. [ ] 克隆依赖项目
3. [ ] 配置 monorepo
4. [ ] 设置开发环境

### 第二阶段：构建流程

1. [ ] 移除压缩文件
2. [ ] 配置开发构建
3. [ ] 更新 VS Code 扩展
4. [ ] 测试基本功能

### 第三阶段：调试支持

1. [ ] 配置 sourcemap
2. [ ] 设置调试工具
3. [ ] 添加日志系统
4. [ ] 测试调试功能

### 第四阶段：自定义开发

1. [ ] 实现样式定制
2. [ ] 添加新功能
3. [ ] 优化性能
4. [ ] 完善文档

## 开发流程

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build
```

### 调试流程

- 使用 Chrome DevTools 调试 webview
- 使用 VS Code 调试扩展
- 支持热重载和实时预览
- 需要 VS Code 环境支持

### 测试流程

- 每个包都有独立的测试
- 支持单元测试和集成测试
- 需要模拟 VS Code API
- 自动化测试和持续集成

## 注意事项

1. 保持向后兼容
2. 确保性能不受影响
3. 维护良好的文档
4. 遵循开源协议
5. 定期同步上游更新

## 参考资源

1. [Markwhen Timeline](https://github.com/mark-when/timeline)
2. [Markwhen Calendar](https://github.com/mark-when/calendar)
3. [Markwhen View Client](https://github.com/mark-when/view-client)
4. [Markwhen Parser](https://github.com/mark-when/parser)
5. [VS Code Extension API](https://code.visualstudio.com/api)
