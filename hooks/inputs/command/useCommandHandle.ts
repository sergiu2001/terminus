import { AuthService } from '@/services/authService';
import { scheduleBackgroundCheck } from '@/session/game/backgroundTask';
import useProfileStore from '@/session/stores/useProfileStore';
import useSessionStore from '@/session/stores/useSessionStore';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

type CommandContext = 'main' | 'contract-selection';

interface Contract {
    id: string;
    name: string;
    difficulty: number;
    level: 'easy' | 'medium' | 'hard';
    duration: number;
}

const contracts: Contract[] = [
    { id: '1', name: 'Contract A', difficulty: 5, level: 'medium', duration: 3 * 60 * 1000 },
    { id: '2', name: 'Contract B', difficulty: 3, level: 'easy', duration: 3 * 60 * 1000 },
    { id: '3', name: 'Contract C', difficulty: 7, level: 'hard', duration: 3 * 60 * 1000 },
];

export const useCommands = (
    logs: string[],
    setLogs: (logs: string[]) => void,
    history: string[],
    setHistory: (history: string[]) => void
) => {
    // using zustand action helper start directly
    const [commandContext, setCommandContext] = useState<CommandContext>('main');

    const handleCommand = useCallback((text: string) => {
        let newLogs = [...logs, `>.>*!* ${text}`];
        let newHistory = [...history, text];
        const command = text.trim().toLowerCase();

        if (commandContext === 'main') {
            switch (command) {
                case 'help':
                    newLogs.push('This is the list of available commands*!*');
                    newLogs.push('\t'.repeat(3) + '~ SCAN\n' + '\t'.repeat(3) + '~ PROFILE\n' + '\t'.repeat(3) + '~ LOGOUT\n' + '\t'.repeat(3) + '~ CLC\n' + '\t'.repeat(3) + '~ EXIT');
                    break;
                case 'scan':
                    setCommandContext('contract-selection');
                    newLogs.push('Scanning for available contracts...');
                    newLogs.push('Found 3 contracts...');
                    contracts.forEach((contract, index) => {
                        newLogs.push(`${index + 1}. ${contract.name} - Difficulty: ${contract.difficulty}`);
                    });
                    newLogs.push('Enter contract number to select, or "back" to return...');
                    break;
                case 'profile': {
                    const p = useProfileStore.getState().profile;
                    if (!p) {
                        newLogs.push('No profile found.');
                    } else {
                        newLogs.push('═══════════════════════════════════');
                        newLogs.push('        AGENT PROFILE');
                        newLogs.push('═══════════════════════════════════');
                        newLogs.push(`ID:        ${p.id}`);
                        newLogs.push(`Username:  ${p.username}`);
                        newLogs.push(`Level:     ${p.stats?.level ?? 1}`);
                        newLogs.push(`XP:        ${p.stats?.xp ?? 0}/${p.stats?.xpToNextLevel ?? 100}`);
                        newLogs.push('───────────────────────────────────');
                        newLogs.push(`Money:     $${p.money}`);
                        newLogs.push(`Tokens:    ${p.tokens}`);
                        newLogs.push('───────────────────────────────────');
                        newLogs.push(`Completed: ${p.stats?.contractsCompleted ?? 0}`);
                        newLogs.push(`Failed:    ${p.stats?.contractsFailed ?? 0}`);
                        newLogs.push(`Win Rate:  ${p.getWinRate?.() ?? 0}%`);
                        newLogs.push(`Earnings:  $${p.stats?.totalEarnings ?? 0}`);
                        newLogs.push('═══════════════════════════════════');
                    }
                    break;
                }
                case 'logout':
                    newLogs.push('Signing out...');
                    AuthService.signOut().catch((e) => newLogs.push(`Logout error: ${e?.message || 'Unknown error'}`));
                    router.replace('/auth');
                    break;
                case 'clc':
                    // clear console
                    newLogs = [];
                    newHistory = [];
                    break;
                default:
                    newLogs.push(`Unknown command ${text}. Use help to see all available commands.`);
                    break;
            }
        } else if (commandContext === 'contract-selection') {
            if (command === 'back') {
                setCommandContext('main');
                newLogs.push('Returning to main menu...');
            } else {
                const contractIndex = parseInt(command) - 1;
                const contract = contracts[contractIndex];
                
                if (contract) {
                    newLogs.push(`You have selected ${contract.name}. Difficulty: ${contract.difficulty}`);
                    useSessionStore.getState().start({ level: contract.level, duration: contract.duration });
                    const endTime = Date.now() + contract.duration;
                    scheduleBackgroundCheck(endTime);
                    router.replace('/game');
                    setCommandContext('main');
                } else {
                    newLogs.push('Invalid contract selection. Please enter a valid number or "back".');
                }
            }
        }

        setLogs(newLogs);
        setHistory(newHistory);
    }, [logs, history, commandContext, setLogs, setHistory]);

    return { handleCommand };
};