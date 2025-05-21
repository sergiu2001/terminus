# Terminus: Codex - Cyberpunk Terminal Hacking Simulator

## Introduction

Terminus: Codex is an immersive cyberpunk terminal hacking simulator that puts you in the role of a cyber operative in a dystopian future. Complete hacking contracts, increase your reputation, unlock new avatars and themes, and climb the ranks of the digital underground.

The application features a retro terminal UI aesthetic with scanlines, flickering effects, and a command-line interface that brings the cyberpunk experience to life.

## Features

- **Authentic Terminal Experience**: Complete with flickering effects, scanlines, and retro CRT styling
- **Contract-based Gameplay**: Accept and complete hacking contracts by solving tasks
- **Progression System**: Earn XP and reputation to unlock new ranks and titles
- **Currency System**: Earn "trojans" as in-game currency to purchase upgrades
- **Customization**: Unlock and select different themes and strategist avatars
- **Secure Authentication**: Firebase-powered authentication and secure data storage
- **Cross-Platform**: Built with React Native and Expo for iOS, Android, and web support

## Technologies

- **Frontend**: React Native, Expo
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **UI**: Custom terminal-inspired components
- **Navigation**: Expo Router

## Project Structure

```
terminus-codex/
├── app/                 # Expo Router screens
│   ├── auth.tsx         # Authentication screen
│   ├── game.tsx         # Main gameplay screen
│   ├── index.tsx        # Home screen
│   ├── profile.tsx      # User profile screen
│   ├── store.tsx        # Store for purchasing items
│   └── _layout.tsx      # App layout and navigation setup
├── assets/              # Static assets
│   ├── fonts/           # Custom fonts
│   ├── images/          # Images and icons
│   └── themes/          # Theme configurations
├── components/          # Reusable UI components
│   ├── Avatar.tsx       # User avatar component
│   ├── CommandInput.tsx # Terminal command input
│   ├── GameDisplay.tsx  # Game output display
│   ├── LogDisplay.tsx   # Terminal log display
│   └── ...              # Other components
├── context/             # React Context providers
│   ├── ProfileContext.tsx # User profile data
│   └── ThemeContext.tsx   # Theme management
├── hooks/               # Custom React hooks
│   ├── useAuthListener.ts # Firebase auth state
│   ├── useScanlineAnimation.ts # CRT effects
│   └── ...              # Other hooks
├── models/              # Data models and classes
│   ├── Contract.ts      # Game contract structure
│   ├── Profile.ts       # User profile model
│   ├── Task.ts          # Contract task model
│   └── ...              # Other models
└── services/            # API and service layer
    ├── firebaseAuthService.ts     # Auth functions
    ├── firebaseFirestoreService.ts # Database functions
    └── firebaseStorageService.ts   # Storage functions
```

## Core Commands

The Terminus terminal recognizes the following commands:

### Main Terminal
- `HELP` - View available commands
- `SCAN` - Search for new contracts
- `PROFILE` - View your operative profile
- `STORE` - Access the avatar and theme store
- `SYS` - Access system settings
- `LOGOUT` - Log out of your account
- `CLC` - Clear the screen
- `EXIT` - Exit the application

## Rank System

Gain XP to increase your operative's reputation and unlock new ranks:

| Rank | Title | Required XP |
|------|-------|------------|
| 1 | Nullus | 0 |
| 2 | Novitiate | 250 |
| 3 | Thrall | 500 |
| ... | ... | ... |
| 30 | Imperator | 100,000 |
