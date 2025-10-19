# MCP Server Quick Reference

## Available Tools

### 1. read_game_config
Read specific game configuration files.

**Parameters:**
- `config_type`: `"contract"` | `"tasks"` | `"profile"` | `"session"` | `"firebase"`

**Example:**
```json
{
  "config_type": "tasks"
}
```

### 2. get_game_stats
Get statistics about game content.

**Parameters:** None

**Returns:**
- Total task count
- Tasks by difficulty (basic, intermediate, advanced)
- Game features list

### 3. list_components
List React components by category.

**Parameters:**
- `category`: `"all"` | `"displays"` | `"inputs"` | `"overlay"` | `"screens"` (default: `"all"`)

**Example:**
```json
{
  "category": "displays"
}
```

### 4. search_game_logic
Search through game logic files for specific terms.

**Parameters:**
- `query`: Search term (string)

**Example:**
```json
{
  "query": "validation"
}
```

### 5. get_store_info
Get information about Zustand stores.

**Parameters:**
- `store`: `"profile"` | `"session"` | `"all"` (default: `"all"`)

**Example:**
```json
{
  "store": "profile"
}
```

## Available Resources

### 1. terminus://project/structure
Overview of project architecture and directory structure.

**Format:** Markdown

### 2. terminus://game/tasks
All game task definitions with descriptions and rules.

**Format:** TypeScript source

### 3. terminus://game/rules
Task validation rules and logic.

**Format:** TypeScript source

### 4. terminus://config/firebase
Firebase configuration guide and environment variables.

**Format:** Markdown

## Usage Examples

### With AI Assistant

**"Show me all game tasks"**
→ Uses `read_game_config` with `config_type: "tasks"`

**"How many tasks are in the game?"**
→ Uses `get_game_stats`

**"List all input components"**
→ Uses `list_components` with `category: "inputs"`

**"Find validation code"**
→ Uses `search_game_logic` with `query: "validation"`

**"Explain the profile store"**
→ Uses `get_store_info` with `store: "profile"`

**"What's the project structure?"**
→ Reads resource `terminus://project/structure`

## Testing

Test the server manually:

```bash
cd mcp-server
node index.js
```

Then send JSON-RPC requests via stdin.

## Configuration Location

`.vscode/mcp.json` - MCP server configuration
`mcp-server/index.js` - Server implementation
`mcp-server/package.json` - Dependencies

## Adding New Tools

1. Add tool definition in `ListToolsRequestSchema` handler
2. Add tool implementation in `CallToolRequestSchema` handler
3. Update this reference guide
4. Restart VS Code or reload window

## Adding New Resources

1. Add resource definition in `ListResourcesRequestSchema` handler
2. Add resource reader in `ReadResourceRequestSchema` handler
3. Update this reference guide

## Common Issues

**Server not starting:**
- Run `npm install` in `mcp-server/` directory
- Check Node.js version (requires v18+)
- Verify `.vscode/mcp.json` syntax

**Tools not working:**
- Check project structure hasn't changed
- Verify file paths are correct
- Look at VS Code MCP logs

**Resource not found:**
- Ensure URI matches registered resources
- Check for typos in URI scheme
