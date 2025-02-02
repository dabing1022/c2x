# C2X - VSCode 扩展

### 描述
C2X (Code to Xcode) 是一个 VSCode 扩展，让你能够快速地从 VSCode 在 Xcode 中打开文件或项目。

### 功能
- 在 Xcode 中打开当前文件，并保持光标位置
- 在 Xcode 中打开当前项目
- 支持 .xcodeproj 和 .xcworkspace 项目
- 自动检测 Xcode 路径

### 安装
1. 通过 VSCode 应用市场安装
2. 或下载 .vsix 文件手动安装

### 使用方法
- 使用 `Cmd+Shift+X` 在 Xcode 中打开当前文件
- 使用命令面板（`Cmd+Shift+P`）并搜索：
  - "Open File in Xcode"
  - "Open Project in Xcode"
- 在资源管理器中右键点击文件/文件夹，选择"在 Xcode 中打开"

### 配置
前往 设置 > 扩展 > C2X：
- `c2x.xcodePath`：自定义 Xcode.app 路径（可选）

### 系统要求
- macOS
- 已安装 Xcode
- VSCode 1.60.0 或更高版本

[English Documentation](README.md) 