import { ThemeVars } from "@/assets/themes/themeTypes";

export class ThemeItem{
    themeName: string;
    themeVars: ThemeVars;
    themeDescription: string;
    themeCost: number;
    themeLocked: boolean;
    themeSelected: boolean;
    
    constructor(
        themeName: string,
        themeVars: ThemeVars,
        themeDescription: string,
        themeCost: number,
        themeLocked: boolean,
        themeSelected: boolean,
    ) {
        this.themeName = themeName;
        this.themeVars = themeVars;
        this.themeDescription = themeDescription;
        this.themeCost = themeCost;
        this.themeLocked = themeLocked;
        this.themeSelected = themeSelected;
    }
}

