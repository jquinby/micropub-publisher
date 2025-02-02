import * as vscode from 'vscode';
import fetch from 'node-fetch';

// Configuration interface
interface MicropubConfig {
    token: string;
    endpoint: string;
}

interface ParsedContent {
    title?: string;
    content: string;
    tags?: string[];
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('micropub.publish', async () => {
        try {
            const config = getConfiguration();
            if (!config) {
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const content = editor.document.getText();
            console.log('Raw content:', content);
            const parsedContent = parseMarkdownContent(content);
            
            await publishPost(parsedContent, config);
            vscode.window.showInformationMessage('Successfully published to micro.blog');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            vscode.window.showErrorMessage(`Failed to publish: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
}

function getConfiguration(): MicropubConfig | undefined {
    const config = vscode.workspace.getConfiguration('micropub');
    const token = config.get<string>('token');
    const endpoint = config.get<string>('endpoint');

    if (!token || !endpoint) {
        vscode.window.showErrorMessage('Micropub configuration missing. Please set token and endpoint.');
        return undefined;
    }

    return { token, endpoint };
}

function parseMarkdownContent(content: string): ParsedContent {
    console.log('Parsing content:', content);
    const lines = content.split('\n');
    let inFrontMatter = false;
    let frontMatter = '';
    let mainContent = '';
    let title: string | undefined;
    let tags: string[] = [];

    for (const line of lines) {
        if (line.trim() === '---') {
            inFrontMatter = !inFrontMatter;
            continue;
        }

        if (inFrontMatter) {
            frontMatter += line + '\n';
        } else {
            mainContent += line + '\n';
        }
    }

    // Parse front matter
    if (frontMatter) {
        const titleMatch = frontMatter.match(/title:\s*(.+)/);
        if (titleMatch) {
            title = titleMatch[1].trim();
        }

        const tagsMatch = frontMatter.match(/tags:\s*\[(.*)\]/);
        if (tagsMatch) {
            tags = tagsMatch[1].split(',').map(tag => tag.trim());
        }
    }

    const result = {
        title,
        content: mainContent.trim(),
        tags: tags.length > 0 ? tags : undefined
    };
    
    console.log('Parsed result:', result);
    return result;
}

async function publishPost(parsed: ParsedContent, config: MicropubConfig): Promise<void> {
    const micropubRequest = new URLSearchParams();
    micropubRequest.append('h', 'entry');
    micropubRequest.append('content', parsed.content);
    
    if (parsed.title) {
        micropubRequest.append('name', parsed.title);
    }
    
    if (parsed.tags && parsed.tags.length > 0) {
        parsed.tags.forEach(tag => micropubRequest.append('category[]', tag));
    }

    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: micropubRequest.toString()
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.log('Request:', micropubRequest.toString());
        console.log('Response:', response.status, errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
}
