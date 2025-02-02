import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

function getXcodePath(): string {
    // 首先尝试使用 xcode-select -p 获取当前选择的 Xcode 路径
    try {
        const { execSync } = require('child_process');
        const selectedPath = execSync('xcode-select -p').toString().trim();
        // 将 Contents/Developer 路径转换为 Xcode.app 路径
        if (selectedPath.includes('/Contents/Developer')) {
            const xcodePath = selectedPath.split('/Contents/Developer')[0];
            if (fs.existsSync(xcodePath)) {
                return xcodePath;
            }
        }
    } catch (error) {
        console.log('Failed to get Xcode path from xcode-select:', error);
    }

    // 查找所有可能的 Xcode 安装路径
    const commonPaths = [
        '/Applications/Xcode.app',
        `${os.homedir()}/Applications/Xcode.app`
    ];

    // 添加带版本号的 Xcode 路径搜索
    try {
        const applicationsPath = '/Applications';
        const userApplicationsPath = `${os.homedir()}/Applications`;
        
        [applicationsPath, userApplicationsPath].forEach(basePath => {
            if (fs.existsSync(basePath)) {
                fs.readdirSync(basePath).forEach(file => {
                    if (file.startsWith('Xcode') && file.endsWith('.app')) {
                        commonPaths.push(`${basePath}/${file}`);
                    }
                });
            }
        });
    } catch (error) {
        console.log('Error searching for Xcode installations:', error);
    }

    // 遍历所有可能的路径，返回第一个存在的路径
    for (const path of commonPaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }

    // 如果所有路径都不存在，则返回默认路径
    return '/Applications/Xcode.app';
}

export function activate(context: vscode.ExtensionContext) {
    console.log('C2X is now active!');
    console.log('Registering commands...');

    try {
        let openFileDisposable = vscode.commands.registerCommand('C2X.openFileInXcode', async (uri?: vscode.Uri) => {
            console.log('openFileInXcode command triggered');
            // 检查是否在 macOS 平台
            if (os.platform() !== 'darwin') {
                vscode.window.showErrorMessage('C2X only supports macOS!');
                return;
            }

            let filePath: string;
            let line = 1;
            let column = 1;

            if (uri) {
                filePath = uri.fsPath;
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.uri.fsPath === filePath) {
                    line = editor.selection.active.line + 1;
                    column = editor.selection.active.character + 1;
                }
            } else {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No active editor!');
                    return;
                }
                filePath = editor.document.uri.fsPath;
                line = editor.selection.active.line + 1;
                column = editor.selection.active.character + 1;
            }

            const config = vscode.workspace.getConfiguration('c2x');
            let xcodePath = config.get<string>('xcodePath') || getXcodePath();

            // 构建 Xcode 打开文件的命令
            // 使用 xed 命令行工具打开文件，它是 Xcode 自带的
            const command = `xed -w -l ${line} "${filePath}"`;

            console.log('Executing command:', command);

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error executing command:', error);
                    console.error('Stderr:', stderr);
                    vscode.window.showErrorMessage(`Failed to open Xcode: ${error.message}`);
                    return;
                }
                if (stdout) {
                    console.log('Command output:', stdout);
                }
                if (stderr) {
                    console.log('Command stderr:', stderr);
                }
            });
        });

        console.log('Command C2X.openFileInXcode registered successfully');
        context.subscriptions.push(openFileDisposable);
    } catch (error) {
        console.error('Failed to register command:', error);
    }

    let openProjectDisposable = vscode.commands.registerCommand('C2X.openProjectInXcode', async () => {
        if (os.platform() !== 'darwin') {
            vscode.window.showErrorMessage('C2X only supports macOS!');
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder is opened!');
            return;
        }

        const projectPath = workspaceFolders[0].uri.fsPath;
        
        // 查找 .xcodeproj 或 .xcworkspace 文件
        let xcodeProjectPath = '';
        if (fs.existsSync(`${projectPath}/project.xcworkspace`)) {
            xcodeProjectPath = `${projectPath}/project.xcworkspace`;
        } else if (fs.existsSync(`${projectPath}/project.xcodeproj`)) {
            xcodeProjectPath = `${projectPath}/project.xcodeproj`;
        }

        const command = `xed -w "${xcodeProjectPath || projectPath}"`;

        console.log('Executing command:', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing command:', error);
                console.error('Stderr:', stderr);
                vscode.window.showErrorMessage(`Failed to open project in Xcode: ${error.message}`);
                return;
            }
            if (stdout) {
                console.log('Command output:', stdout);
            }
            if (stderr) {
                console.log('Command stderr:', stderr);
            }
        });
    });

    context.subscriptions.push(openProjectDisposable);
}

export function deactivate() {} 