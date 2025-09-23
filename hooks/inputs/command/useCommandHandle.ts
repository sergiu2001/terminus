import { scheduleBackgroundCheck } from '@/session/game/backgroundTask';
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
                    newLogs.push('\t'.repeat(3) + '~ SCAN\n' + '\t'.repeat(3) + '~ PROFILE\n' + '\t'.repeat(3) + '~ SYS\n' + '\t'.repeat(3) + '~ LOGOUT\n' + '\t'.repeat(3) + '~ CLC\n' + '\t'.repeat(3) + '~ EXIT');
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