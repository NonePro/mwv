// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  MarkwhenTimelineEditorProvider,
  webviewPanels,
} from "./MarkwhenTimelineEditorProvider";
import "./semanticTokenProvider";
import { legend, provider } from "./semanticTokenProvider";
import * as path from 'path';

const command_preview = "markwhen.openPreview";
const command_viewInTimeline = "markwhen.viewInTimeline";

export function activate(context: vscode.ExtensionContext) {
  console.log('Markwhen Timeline 扩展已激活');

  const { providerRegistration, editor } =
    MarkwhenTimelineEditorProvider.register(context);

  vscode.languages.registerDocumentSemanticTokensProvider(
    { language: "markwhen", scheme: "file" },
    provider,
    legend
  );

  vscode.languages.registerHoverProvider("markwhen", editor);
  vscode.languages.registerFoldingRangeProvider("markwhen", editor);

  const openPreview = async () => {
    const active = vscode.window.activeTextEditor;
    if (!active) {
      return;
    }
    return vscode.commands.executeCommand(
      "vscode.openWith",
      active.document.uri,
      "markwhen.timeline",
      vscode.ViewColumn.Beside
    );
  };

  let disposable = vscode.commands.registerCommand('markwhen.openTimeline', () => {
    // 创建 WebView 面板
    const panel = vscode.window.createWebviewPanel(
      'markwhen',
      'Markwhen Timeline',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'timeline'))
        ]
      }
    );

    // 设置 WebView 的 HTML 内容
    panel.webview.html = getWebviewContent(context, panel.webview);

    // 处理来自 WebView 的消息
    panel.webview.onDidReceiveMessage(
      message => {
        console.log('收到来自 WebView 的消息:', message);
        switch (message.type) {
          case 'markwhenState':
            console.log('状态更新:', message.params);
            break;
          case 'appState':
            console.log('应用状态更新:', message.params);
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(
    providerRegistration,
    vscode.commands.registerCommand(command_preview, openPreview),
    vscode.commands.registerCommand(command_viewInTimeline, async (arg) => {
      if (!webviewPanels.length) {
        await openPreview();
      }
      editor.viewInTimeline(arg);
    }),
    vscode.commands.registerCommand("markwhen.timelineView", async (arg) => {
      if (!webviewPanels.length) {
        await openPreview();
      }
      await editor.setView("timeline");
      editor.postState()
    }),
    vscode.commands.registerCommand("markwhen.calendarView", async (arg) => {
      if (!webviewPanels.length) {
        await openPreview();
      }
      await editor.setView("calendar");
      editor.postState()
    }),
    disposable
  );
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview) {
  // 获取构建后的文件路径
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'timeline', 'dist', 'assets', 'index.js'))
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'timeline', 'dist', 'assets', 'index.css'))
  );

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${styleUri}">
      </head>
      <body>
        <div id="app"></div>
        <script src="${scriptUri}"></script>
      </body>
    </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Markwhen Timeline 扩展已停用');
}
