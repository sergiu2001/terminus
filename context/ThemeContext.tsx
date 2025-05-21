// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode} from 'react';
import { themes, ThemeType } from '@/assets/themes/themes';
import { gameStyles } from '@/assets/styles/gameStyle';

type ThemeContextType = {
    theme: ThemeType;
    themeStyles: ReturnType<typeof gameStyles>;
    setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // default theme
    const [theme, setTheme] = useState<ThemeType>('Original');

    // generate the styles based on the current theme's variables
    const themeStyles = gameStyles(themes[theme]);

    return (
        <ThemeContext.Provider value={{ theme, themeStyles, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
