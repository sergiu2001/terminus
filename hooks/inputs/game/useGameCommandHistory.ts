import { useState, useCallback } from 'react';

export const useInputHistory = (persistedHistory: string[] = []) => {
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    const navigateHistory = useCallback(() => {
        if (persistedHistory.length === 0) return '';

        const newIndex = (historyIndex + 1) % (persistedHistory.length + 1);
        setHistoryIndex(newIndex);

        if (newIndex === persistedHistory.length) {
            return '';
        } else {
            return persistedHistory[newIndex];
        }
    }, [persistedHistory, historyIndex]);

    const resetHistoryIndex = useCallback(() => {
        setHistoryIndex(-1);
    }, []);

    return { navigateHistory, resetHistoryIndex };
};