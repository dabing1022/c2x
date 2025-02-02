# C2X - VSCode Extension

[English](README.md) | [中文](README_zh.md)

### Description
C2X (Code to Xcode) is a VSCode extension that allows you to quickly open files or projects in Xcode from VSCode.

### Features
- Open current file in Xcode with cursor position
- Open current project in Xcode
- Support for both .xcodeproj and .xcworkspace projects
- Automatic Xcode path detection

### Installation
1. Install through VSCode marketplace
2. Or download .vsix file and install manually

### Usage
- Use `Cmd+Shift+X` to open current file in Xcode
- Use command palette (`Cmd+Shift+P`) and search for:
  - "Open File in Xcode"
  - "Open Project in Xcode"
- Right-click on file/folder in explorer and select "Open in Xcode"

### Configuration
Go to Settings > Extensions > C2X:
- `c2x.xcodePath`: Custom path to Xcode.app (optional)

### Requirements
- macOS
- Xcode installed
- VSCode 1.60.0 or above

[中文文档](README_zh.md) 