# Markwhen

View and edit markwhen documents.

Read the markwhen documentation [here](https://docs.markwhen.com).

![](https://blog.markwhen.com/images/calendar_comp3.png)
![](https://blog.markwhen.com/images/calendar2.png)
![](https://blog.markwhen.com/images/calendar_comp2.png)

## Features

- Calendar view
- Map view
- Gantt view
- Timeline View
- Edit from the timeline
- Pages
- Now line
- Tags

## 项目架构

### 1. VS Code 扩展版本

本项目是一个 VS Code 扩展，用于可视化 Markwhen 文档。主要包含以下组件：

1. **核心组件**
   - `@markwhen/parser`: 解析 Markwhen 文档语法
   - `@markwhen/timeline`: 时间线视图组件
   - `@markwhen/calendar`: 日历视图组件
   - `@markwhen/view-client`: 视图通信工具

2. **视图渲染流程**
   - 文档内容通过 `@markwhen/parser` 解析为结构化数据
   - 解析后的数据通过 `@markwhen/view-client` 传递给视图组件
   - 视图组件（timeline/calendar）接收数据并渲染可视化界面
   - 用户交互通过 `view-client` 回传给编辑器

### 2. Web 版本

我们提供了一个简洁的 Web 版本实现，位于 `src/views/timeline` 目录下。这个 Web 版本最终将集成到 VS Code 扩展的 Webview 中，实现与编辑器的双向通信。

#### 集成目标

1. **编辑器与 Webview 的双向通信**
   - Markdown 内容在 VS Code 编辑器中编辑
   - 可视化界面在 Webview 中展示
   - 实时同步编辑器和 Webview 的状态

2. **交互体验**
   - 支持在 Webview 中拖拽调整事件时间
   - 支持在 Webview 中编辑事件内容
   - 支持在 Webview 中进行视图切换
   - 所有修改实时反映到编辑器的 Markdown 中

3. **通信机制**

   ```typescript
   // Webview 端
   const vscode = acquireVsCodeApi();
   
   // 发送消息到编辑器
   vscode.postMessage({
     type: 'update',
     content: '新的 Markdown 内容'
   });
   
   // 接收编辑器消息
   window.addEventListener('message', event => {
     const message = event.data;
     // 处理编辑器发送的消息
   });
   
   // 编辑器端
   webview.postMessage({
     type: 'update',
     content: '新的解析数据'
   });
   ```

#### 技术栈

- Vue 3 + TypeScript
- Vite
- Pinia (状态管理)
- Tailwind CSS

#### 目录结构

```
src/views/timeline/
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.ts          # 应用入口
│   ├── Timeline/        # 时间线组件
│   └── Markwhen/        # Markwhen 相关工具
├── public/              # 静态资源
├── test.mw             # 测试数据
└── vite.config.ts      # Vite 配置
```

#### 核心功能

1. **数据解析**
   - 使用 `@markwhen/parser` 解析 Markwhen 文档
   - 支持实时解析和渲染

2. **状态管理**
   - 使用 Pinia 管理应用状态
   - 包含文档数据、UI 状态等

3. **视图渲染**
   - 基于 Vue 3 的响应式渲染
   - 支持时间线视图
   - 可扩展支持其他视图

#### 开发指南

1. **启动开发服务器**

```bash
cd src/views/timeline
npm install
npm run dev
```

2. **构建生产版本**

```bash
npm run build
```

3. **测试数据格式**

```markdown
title: 我的时间线
description: 时间线描述

section 第一部分
2024/01/01: 事件1
2024/02/01: 事件2
endSection

section 第二部分
2024/03/01: 事件3
2024/04/01: 事件4
endSection
```

## 自定义开发

### 1. 集成视图组件

```typescript
import { useLpc } from "@markwhen/view-client";
import Timeline from "@markwhen/timeline";
import Calendar from "@markwhen/calendar";

// 初始化视图通信
const { postRequest } = useLpc({
  markwhenState(ms) {
    // 处理文档状态变化
    console.log(ms);
  },
  appState(newState) {
    // 处理应用状态变化（暗黑模式、事件悬停等）
    console.log(newState);
  }
});

// 渲染时间线视图
const timeline = new Timeline({
  target: document.getElementById('timeline'),
  props: {
    // 配置项
  }
});

// 渲染日历视图
const calendar = new Calendar({
  target: document.getElementById('calendar'),
  props: {
    // 配置项
  }
});
```

### 2. 自定义视图样式

视图组件支持通过 CSS 变量自定义样式：

```css
:root {
  --mw-primary-color: #0078d4;
  --mw-secondary-color: #2b88d8;
  --mw-background-color: #ffffff;
  --mw-text-color: #333333;
}
```

### 3. 扩展功能

1. **添加新视图**
   - 创建新的视图组件
   - 实现 `view-client` 接口
   - 注册到 VS Code 扩展

2. **自定义交互**
   - 通过 `view-client` 的事件系统
   - 实现自定义的事件处理逻辑

## Development Guide

### 项目架构

本项目是一个 VS Code 扩展，用于可视化 Markwhen 文档。主要包含以下组件：

1. **核心组件**
   - `@markwhen/parser`: 解析 Markwhen 文档语法
   - `@markwhen/timeline`: 时间线视图组件
   - `@markwhen/calendar`: 日历视图组件
   - `@markwhen/view-client`: 视图通信工具

2. **视图渲染流程**
   - 文档内容通过 `@markwhen/parser` 解析为结构化数据
   - 解析后的数据通过 `@markwhen/view-client` 传递给视图组件
   - 视图组件（timeline/calendar）接收数据并渲染可视化界面
   - 用户交互通过 `view-client` 回传给编辑器

### 自定义开发

#### 1. 集成视图组件

```typescript
import { useLpc } from "@markwhen/view-client";
import Timeline from "@markwhen/timeline";
import Calendar from "@markwhen/calendar";

// 初始化视图通信
const { postRequest } = useLpc({
  markwhenState(ms) {
    // 处理文档状态变化
    console.log(ms);
  },
  appState(newState) {
    // 处理应用状态变化（暗黑模式、事件悬停等）
    console.log(newState);
  }
});

// 渲染时间线视图
const timeline = new Timeline({
  target: document.getElementById('timeline'),
  props: {
    // 配置项
  }
});

// 渲染日历视图
const calendar = new Calendar({
  target: document.getElementById('calendar'),
  props: {
    // 配置项
  }
});
```

#### 2. 自定义视图样式

视图组件支持通过 CSS 变量自定义样式：

```css
:root {
  --mw-primary-color: #0078d4;
  --mw-secondary-color: #2b88d8;
  --mw-background-color: #ffffff;
  --mw-text-color: #333333;
}
```

#### 3. 扩展功能

1. **添加新视图**
   - 创建新的视图组件
   - 实现 `view-client` 接口
   - 注册到 VS Code 扩展

2. **自定义交互**
   - 通过 `view-client` 的事件系统
   - 实现自定义的事件处理逻辑

3. **主题定制**
   - 支持 VS Code 主题集成
   - 自定义颜色方案

### 开发环境设置

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run watch
```

3. 调试扩展

- 按 F5 启动调试
- 选择 "Run Extension" 配置

## Release Notes
