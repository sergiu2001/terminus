# Terminus MCP Server

This is a Model Context Protocol (MCP) server specifically designed for the Terminus game project. It provides AI assistants with deep project context and useful tools for understanding and working with the codebase.

## Features

### Tools
1. **read_game_config** - Read game configuration files
   - Contract definitions
   - Task definitions
   - Profile structure
   - Session management
   - Firebase configuration

2. **get_game_stats** - Get statistics about the game
   - Task counts by difficulty
   - Available game features
   - Difficulty levels

3. **list_components** - List React components
   - Filter by category (displays, inputs, overlay, screens)
   - Get component counts and names

4. **search_game_logic** - Search through game logic files
   - Find validation rules
   - Locate difficulty settings
   - Search task mechanics

5. **get_store_info** - Inspect Zustand stores
   - Profile store details
   - Session store details
   - Storage and middleware info

### Resources
1. **Project Structure** - Overview of the codebase architecture
2. **Game Tasks** - All task definitions
3. **Game Rules** - Validation rules for tasks
4. **Firebase Configuration** - Setup and environment variables

## Installation

From the mcp-server directory:

```bash
npm install
```

## Usage

The server is automatically configured in `.vscode/mcp.json` and will start when needed by compatible AI assistants in VS Code.

### Manual Testing

You can test the server manually:

```bash
cd mcp-server
npm start
```

## Configuration

The server is configured in `.vscode/mcp.json`:

```json
{
  "servers": {
    "terminus-project-server": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/index.js"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}",
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Development

To modify the server:

1. Edit `mcp-server/index.js`
2. Add new tools in the `ListToolsRequestSchema` handler
3. Implement tool logic in the `CallToolRequestSchema` handler
4. Add new resources in the `ListResourcesRequestSchema` handler
5. Restart the server (it will auto-restart when files change in VS Code)

## Example Queries

With this MCP server, AI assistants can:

- "Show me the game configuration"
- "What are the current game statistics?"
- "List all display components"
- "Search for validation logic"
- "Explain the profile store"
- "How is Firebase configured?"

## Architecture

```
mcp-server/
├── index.js        # Main server implementation
├── package.json    # Dependencies
└── README.md       # This file
```

The server uses:
- **@modelcontextprotocol/sdk** - MCP SDK for Node.js
- **stdio transport** - Communication via standard input/output
- **Project file system** - Direct access to project files

## Security

The server only has access to files within the project directory and cannot:
- Access files outside the project
- Make network requests (except what's defined)
- Execute arbitrary commands
- Modify files (read-only by default)

## Troubleshooting

If the server doesn't start:

1. Check that Node.js is installed: `node --version`
2. Install dependencies: `cd mcp-server && npm install`
3. Check VS Code MCP logs
4. Verify the path in `.vscode/mcp.json` is correct

## License

Part of the Terminus project.
