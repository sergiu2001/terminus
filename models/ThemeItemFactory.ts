import { themes } from "@/assets/themes/themes";
import { ThemeItem } from "./ThemeItem";

const defaultThemeItems : { [key: string]: ThemeItem } = {
    Original: {
        themeVars: themes.Original,
        themeName: 'Original',
        themeDescription: 'Nothing better than the original',
        themeCost: 500,
        themeLocked: false,
        themeSelected: true
    },
    // RetroWave: {
    //     themeVars: themes.RetroWave,
    //     themeName: 'RetroWave',
    //     themeDescription: 'A blast from the past',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // MysticNight: {
    //     themeVars: themes.MysticNight,
    //     themeName: 'MysticNight',
    //     themeDescription: 'A night of mystery',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // AuroraFlare: {
    //     themeVars: themes.AuroraFlare,
    //     themeName: 'AuroraFlare',
    //     themeDescription: 'A beautiful light show',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // CyberBloom: {
    //     themeVars: themes.CyberBloom,
    //     themeName: 'CyberBloom',
    //     themeDescription: 'A garden of cyber delights',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // SunsetBlaze: {
    //     themeVars: themes.SunsetBlaze,
    //     themeName: 'SunsetBlaze',
    //     themeDescription: 'A fiery sunset',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // ForestEdge: {
    //     themeVars: themes.ForestEdge,
    //     themeName: 'ForestEdge',
    //     themeDescription: 'A walk in the woods',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // CrystalLake: {
    //     themeVars: themes.CrystalLake,
    //     themeName: 'CrystalLake',
    //     themeDescription: 'A peaceful lake',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false        
    // },
    // DesertStorm: {
    //     themeVars: themes.DesertStorm,
    //     themeName: 'DesertStorm',
    //     themeDescription: 'A storm in the desert',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
    // CottonCandy: {
    //     themeVars: themes.CottonCandy,
    //     themeName: 'CottonCandy',
    //     themeDescription: 'A sweet treat',
    //     themeCost: 500,
    //     themeLocked: true,
    //     themeSelected: false
    // },
};

export function createThemeItems(): ThemeItem[] {
    return Object.values(defaultThemeItems);
}