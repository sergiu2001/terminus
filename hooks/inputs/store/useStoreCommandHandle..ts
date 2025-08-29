import { scheduleBackgroundCheck } from '@/session/game/backgroundTask';
import { start } from '@/session/game/gameSessionSlice';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

type CommandContext = 'main' | 'buy-selection';


export const useStoreCommands = (
    logs: string[],
    setLogs: (logs: string[]) => void,
    history: string[],
    setHistory: (history: string[]) => void
) => {
    const dispatch = useDispatch();
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
                default:
                    newLogs.push(`Unknown command ${text}. Use help to see all available commands.`);
                    break;
            }
        } else if (commandContext === 'buy-selection') {
            if (command === 'back') {
                setCommandContext('main');
                newLogs.push('Returning to main menu...');
            } else {

                newLogs.push('Invalid contract selection. Please enter a valid number or "back".');
            }
        }

        setLogs(newLogs);
        setHistory(newHistory);
    }, [logs, history, commandContext, dispatch, setLogs, setHistory]);

    return { handleCommand };
};