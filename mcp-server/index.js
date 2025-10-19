#!/usr/bin/env node

/**
 * Terminus MCP Server
 * Provides project-specific tools and context for the Terminus game
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');

// Initialize MCP Server
const server = new Server(
  {
    name: 'terminus-project-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * Helper function to read project files
 */
async function readProjectFile(relativePath) {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

/**
 * Helper function to list directory contents
 */
async function listDirectory(relativePath = '.') {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
      path: path.join(relativePath, entry.name),
    }));
  } catch (error) {
    throw new Error(`Failed to list directory: ${error.message}`);
  }
}

/**
 * Helper to get game session statistics
 */
async function getGameStats() {
  try {
    const tasksPath = path.join(PROJECT_ROOT, 'models/tasks/TaskDefinitions.ts');
    const content = await fs.readFile(tasksPath, 'utf-8');
    
    // Count task definitions
    const basicTasks = (content.match(/id: 'b\d+'/g) || []).length;
    const intermediateTasks = (content.match(/id: 'i\d+'/g) || []).length;
    const advancedTasks = (content.match(/id: 'a\d+'/g) || []).length;
    
    return {
      totalTasks: basicTasks + intermediateTasks + advancedTasks,
      basic: basicTasks,
      intermediate: intermediateTasks,
      advanced: advancedTasks,
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'read_game_config',
        description: 'Read game configuration files (Contract, Task definitions, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            config_type: {
              type: 'string',
              enum: ['contract', 'tasks', 'profile', 'session', 'firebase'],
              description: 'Type of configuration to read',
            },
          },
          required: ['config_type'],
        },
      },
      {
        name: 'get_game_stats',
        description: 'Get statistics about game tasks, rules, and difficulty levels',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_components',
        description: 'List all React components in the project',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['all', 'displays', 'inputs', 'overlay', 'screens'],
              description: 'Category of components to list',
              default: 'all',
            },
          },
        },
      },
      {
        name: 'search_game_logic',
        description: 'Search for specific game logic, rules, or mechanics',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term (e.g., "validation", "difficulty", "task")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_store_info',
        description: 'Get information about Zustand stores (Profile, Session)',
        inputSchema: {
          type: 'object',
          properties: {
            store: {
              type: 'string',
              enum: ['profile', 'session', 'all'],
              description: 'Which store to inspect',
              default: 'all',
            },
          },
        },
      },
    ],
  };
});

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'terminus://project/structure',
        name: 'Project Structure',
        description: 'Overview of the Terminus project architecture',
        mimeType: 'text/markdown',
      },
      {
        uri: 'terminus://game/tasks',
        name: 'Game Tasks',
        description: 'All available game task definitions',
        mimeType: 'application/json',
      },
      {
        uri: 'terminus://game/rules',
        name: 'Game Rules',
        description: 'Task validation rules',
        mimeType: 'application/json',
      },
      {
        uri: 'terminus://config/firebase',
        name: 'Firebase Configuration',
        description: 'Firebase setup and environment variables',
        mimeType: 'text/markdown',
      },
    ],
  };
});

/**
 * Read resource content
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'terminus://project/structure') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# Terminus Project Structure

## Overview
Terminus is a React Native game built with Expo Router, featuring:
- Terminal-style UI with CRT effects
- Firebase authentication and Firestore sync
- Zustand state management with MMKV persistence
- Task-based gameplay with difficulty levels

## Key Directories
- \`app/\` - Screen components using Expo Router
- \`components/\` - Reusable UI components
- \`models/\` - Game data models (Contract, Task, Profile)
- \`session/\` - State management (stores, sync)
- \`services/\` - External services (Firebase auth)
- \`hooks/\` - Custom React hooks

## Architecture
- **Local-first**: MMKV for local storage
- **Cloud sync**: Firestore for remote persistence
- **State**: Zustand with middleware for persistence
- **Navigation**: Expo Router (file-based)
`,
        },
      ],
    };
  }

  if (uri === 'terminus://game/tasks') {
    const content = await readProjectFile('models/tasks/TaskDefinitions.ts');
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content,
        },
      ],
    };
  }

  if (uri === 'terminus://game/rules') {
    const content = await readProjectFile('models/tasks/TaskRules.ts');
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content,
        },
      ],
    };
  }

  if (uri === 'terminus://config/firebase') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# Firebase Configuration

The project uses Firebase for:
- Authentication (email/password, Google Play Games)
- Firestore database (user profiles, game sessions)
- Crashlytics (error reporting)

## Environment Variables
Required in \`.env\`:
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_DATABASE_URL
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID
- EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID

## Security Rules
Firestore rules should ensure users can only access their own data:
\`\`\`
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
\`\`\`
`,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'read_game_config': {
      const { config_type } = args;
      let filePath;

      switch (config_type) {
        case 'contract':
          filePath = 'models/Contract.ts';
          break;
        case 'tasks':
          filePath = 'models/tasks/TaskDefinitions.ts';
          break;
        case 'profile':
          filePath = 'models/Profile.ts';
          break;
        case 'session':
          filePath = 'models/GameSession.ts';
          break;
        case 'firebase':
          filePath = 'firebaseConfig.js';
          break;
        default:
          throw new Error(`Unknown config type: ${config_type}`);
      }

      const content = await readProjectFile(filePath);
      return {
        content: [
          {
            type: 'text',
            text: `# ${config_type.toUpperCase()} Configuration\n\n\`\`\`typescript\n${content}\n\`\`\``,
          },
        ],
      };
    }

    case 'get_game_stats': {
      const stats = await getGameStats();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                message: 'Game Statistics',
                stats,
                difficulties: ['easy', 'medium', 'hard'],
                features: [
                  'Task-based gameplay',
                  'Difficulty scaling',
                  'Firebase sync',
                  'Local-first architecture',
                  'CRT-style terminal UI',
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'list_components': {
      const { category = 'all' } = args;
      const basePath = 'components';
      
      let components = [];
      if (category === 'all') {
        components = await listDirectory(basePath);
      } else {
        components = await listDirectory(path.join(basePath, category));
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                category,
                components: components.map(c => c.name),
                count: components.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'search_game_logic': {
      const { query } = args;
      const searchPaths = [
        'models/tasks/TaskRules.ts',
        'models/tasks/TaskFactory.ts',
        'models/Contract.ts',
        'models/GameSession.ts',
      ];

      const results = [];
      for (const filePath of searchPaths) {
        try {
          const content = await readProjectFile(filePath);
          if (content.toLowerCase().includes(query.toLowerCase())) {
            const lines = content.split('\n');
            const matchingLines = lines
              .map((line, idx) => ({ line, lineNumber: idx + 1 }))
              .filter(({ line }) => line.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5); // Limit to 5 matches per file

            results.push({
              file: filePath,
              matches: matchingLines,
            });
          }
        } catch (error) {
          // Skip files that don't exist or can't be read
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                resultsCount: results.length,
                results,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'get_store_info': {
      const { store = 'all' } = args;
      const stores = [];

      if (store === 'profile' || store === 'all') {
        const content = await readProjectFile('session/stores/useProfileStore.ts');
        stores.push({
          name: 'Profile Store',
          path: 'session/stores/useProfileStore.ts',
          description: 'Manages user profile data with MMKV persistence',
          features: ['Local-first', 'Firebase sync', 'Version tracking'],
        });
      }

      if (store === 'session' || store === 'all') {
        const content = await readProjectFile('session/stores/useSessionStore.ts');
        stores.push({
          name: 'Session Store',
          path: 'session/stores/useSessionStore.ts',
          description: 'Manages game session state with MMKV persistence',
          features: ['Contract management', 'Task tracking', 'History management'],
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                stores,
                storage: 'MMKV (react-native-mmkv)',
                middleware: ['persist', 'subscribeWithSelector'],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Terminus MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
