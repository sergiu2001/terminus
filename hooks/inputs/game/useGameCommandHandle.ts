import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { finish, updateSession, addMultipleLogs, addToInputHistory } from '@/session/game/gameSessionSlice';
import { router } from 'expo-router';

export const useGameCommands = (
    session: any,
    gameSession: any,
    remaining: any,
    isNavigating: boolean,
    setIsNavigating: (value: boolean) => void
) => {
    const dispatch = useDispatch();

    const handleCommand = useCallback((text: string) => {
        if (!session || isNavigating) return;

        const command = text.trim().toLowerCase();
        const logsToAdd: string[] = [];

        // Add input to history and log it
        dispatch(addToInputHistory(text));
        logsToAdd.push(`>.>*!* ${text}`);

        switch (command) {
            case 'win':
                if (session?.status === 'active') {
                    dispatch(finish('won'));
                }
                break;
            case 'lose':
                if (session?.status === 'active') {
                    dispatch(finish('lost'));
                }
                break;
            case 'status':
                if (session && gameSession) {
                    logsToAdd.push(`Session ID: ${session.id}`);
                    logsToAdd.push(`Difficulty: ${session.level}`);
                    logsToAdd.push(`Status: ${session.status}`);
                    logsToAdd.push(`Time remaining: ${Math.floor(remaining.value / 1000)} seconds`);
                    logsToAdd.push(`Current task: ${session.contract.currentTaskIndex + 1} of ${gameSession.contract.tasks.length}`);
                }
                break;
            case 'abandon':
                if (!isNavigating) {
                    setIsNavigating(true);
                    router.replace('/');
                }
                break;
            case 'help':
                logsToAdd.push('Available commands: status, win, lose, abandon, help');
                logsToAdd.push('Enter any text to attempt solving the current task.');
                break;
            default:
                if (session?.status === 'active' && gameSession) {
                    try {
                        const isValid = gameSession.validateInput(text);
                        if (isValid) {
                            logsToAdd.push('Task completed successfully!');
                            if (gameSession.allTasksCompleted()) {
                                dispatch(finish('won'));
                                // Don't add log here - finish action will handle it
                            } else {
                                const advanced = gameSession.advanceTask();
                                if (advanced) {
                                    dispatch(updateSession());
                                    logsToAdd.push('Moving to next task...');
                                }
                            }
                        }
                    } catch (error) {
                        logsToAdd.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
                break;
        }

        // Add all logs in a single batch to prevent multiple re-renders
        if (logsToAdd.length > 0) {
            dispatch(addMultipleLogs(logsToAdd));
        }
    }, [session, gameSession, remaining, isNavigating, dispatch, setIsNavigating]);

    return { handleCommand };
};