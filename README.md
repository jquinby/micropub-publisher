# VS Code Micropub Publisher

A Visual Studio Code extension for publishing posts to micro.blog (or any Micropub-enabled site) directly from your editor.

## Prerequisites

- Node.js (v16 or higher)
- Visual Studio Code
- A micro.blog site or other Micropub-enabled website

## Dependencies

### Main Dependencies
```json
{
    "node-fetch": "^2.6.1"
}
```

### Development Dependencies
```json
{
    "@types/vscode": "^1.96.0",
    "@types/node": "16.x",
    "@typescript-eslint/eslint-plugin": "^6.4.1",
    "@typescript-eslint/parser": "^6.4.1",
    "eslint": "^8.47.0",
    "typescript": "^5.1.6",
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4",
    "ts-loader": "^9.4.4",
    "@vscode/test-electron": "^2.3.4",
    "@types/node-fetch": "^2.6.1"
}
```

## Installation

### From VSIX file
1. Download the latest `.vsix` file from the releases page
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Install from VSIX" and select "Extensions: Install from VSIX"
5. Navigate to and select the downloaded `.vsix` file

### Building from source
1. Clone this repository
```bash
git clone https://github.com/yourusername/vscode-micropub
cd vscode-micropub
```

2. Install dependencies
```bash
npm install
```

3. Compile the extension
```bash
npm run compile
```

4. Package the extension
```bash
npm install -g @vscode/vsce
vsce package
```

5. Install the generated `.vsix` file in VS Code using the steps above

## Configuration

1. Get your Micropub token:
   - Go to https://micro.blog/account/apps
   - Generate a new app token
   
2. Configure the extension in VS Code:
   - Open VS Code settings (Ctrl+,)
   - Search for "micropub"
   - Set your Micropub endpoint (for micro.blog, use `https://micro.blog/micropub`)
   - Set your access token (include the word "Bearer" before your token)

## Usage

1. Create a new markdown file
2. (Optional) Add front matter for title and tags:
```markdown
---
title: My Post Title
tags: [tag1, tag2]
---
```
3. Write your post content
4. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
5. Type "Publish to Micro.blog" and select the command
6. Your post will be published to your blog

## Example Post
```markdown
---
title: Hello World
tags: [test, first-post]
---
This is my first post published directly from VS Code!
```
