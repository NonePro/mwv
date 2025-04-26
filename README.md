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

## 1.4.4

- Editing from the timeline view (drag event bars and the text will update)

## 1.4.2

- Update timeline

## 1.4.1

- Fix crash in 1.4.0 by using the markwhen parser from a worker

## 1.4.0

- Bump and bundle timeline and calendar versions
- Switch views from the command bar

## 1.3.1

- Expand/collapse all groups/sections
- Timeline view show in editor button now works (moves the cursor to the start of the event)

## 1.3.0

- Recurring events

## 1.2

- Gantt view
- Auto center viewport button

## 1.1.1

- Hosted visualizations require approval to load

# 1.1

- Calendar and map views

## 1.0.1

- Support for markdown-style images (`![](example.com/image.jpg)`)

## 1.0.0

- Support for nesting groups and sections
- Support for code folding (groups/sections/comments)

## 0.3.1

Fix bug where changes made from the timeline view wouldn't reflect in the text editor

## 0.3.0

- Updated UI to match markwhen.com
- Markdown-like preview button
- Basic scroll-to (only works on single page documents or on the first page of multi-page documents)

## 0.2.0

- Editing from the timeline
- Expand events

## 0.1.1

- Tags

### 0.1.0

- Support for pages
- Basic syntax highlighting

### 0.0.1

Initial release.
