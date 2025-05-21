import { ThemeVars } from "./themeTypes";

export type ThemeType = 'Original';

export const themes: Record<ThemeType, ThemeVars> = {
    Original: {
        fontFamily: 'VT323Regular',
        mainColor: '#00FF00', // bright green
        mainShadowColor: '#FFFFFF',
        secondaryColor: '#FFB000', // warm orange
        secondaryShadowColor: '#FFFFFF',
        inputBorderColor: '#00B00099',
        avatarTintColor: '#00FF00',
        avatarBorderColor: '#FFB000AA',
    },
    // RetroWave: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#FF2193', // vivid pink
    //     mainShadowColor: '#800073',
    //     secondaryColor: '#FFD166', // gold highlight
    //     secondaryShadowColor: '#573D1C',
    //     inputBorderColor: '#FF219399',
    //     avatarTintColor: '#FFD166',
    //     avatarBorderColor: '#FFD166AA',
    // },
    // MysticNight: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#BF75FF', // purple
    //     mainShadowColor: '#45006B',
    //     secondaryColor: '#99FB98', // soft green
    //     secondaryShadowColor: '#006B15',
    //     inputBorderColor: '#BF75FF99',
    //     avatarTintColor: '#99FB98',
    //     avatarBorderColor: '#99FB9899',
    // },
    // AuroraFlare: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#AEFF5E', // electric lime
    //     mainShadowColor: '#344F17',
    //     secondaryColor: '#FF6A28', // vibrant orange
    //     secondaryShadowColor: '#601E00',
    //     inputBorderColor: '#AEFF5E99',
    //     avatarTintColor: '#FF6A28',
    //     avatarBorderColor: '#FF6A2899',
    // },
    // CyberBloom: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#F8FFCD', // pale yellow
    //     mainShadowColor: '#555915',
    //     secondaryColor: '#FFB6E2', // light pink
    //     secondaryShadowColor: '#6A2B42',
    //     inputBorderColor: '#F8FFCD99',
    //     avatarTintColor: '#FFB6E2',
    //     avatarBorderColor: '#FFB6E299',
    // },
    // SunsetBlaze: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#FF6F61', // coral red
    //     mainShadowColor: '#822921',
    //     secondaryColor: '#F3B195', // lighter coral
    //     secondaryShadowColor: '#5A2F2B',
    //     inputBorderColor: '#FF6F6199',
    //     avatarTintColor: '#F3B195',
    //     avatarBorderColor: '#F3B19599',
    // },
    // ForestEdge: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#5CEC73', // light green
    //     mainShadowColor: '#1F5A2A',
    //     secondaryColor: '#A8FFBF', // pale mint
    //     secondaryShadowColor: '#294F36',
    //     inputBorderColor: '#5CEC7399',
    //     avatarTintColor: '#A8FFBF',
    //     avatarBorderColor: '#A8FFBF99',
    // },
    // CrystalLake: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#27E2D3', // teal
    //     mainShadowColor: '#105750',
    //     secondaryColor: '#6EF5EA', // lighter teal
    //     secondaryShadowColor: '#26746A',
    //     inputBorderColor: '#27E2D399',
    //     avatarTintColor: '#6EF5EA',
    //     avatarBorderColor: '#6EF5EA99',
    // },
    // DesertStorm: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#FFC864', // sandy orange
    //     mainShadowColor: '#6E4B00',
    //     secondaryColor: '#FFF8E1', // pale beige
    //     secondaryShadowColor: '#6E4B00',
    //     inputBorderColor: '#FFC86499',
    //     avatarTintColor: '#FFF8E1',
    //     avatarBorderColor: '#FFF8E199',
    // },
    // CottonCandy: {
    //     fontFamily: 'VT323Regular',
    //     mainColor: '#FFB6C1', // pink
    //     mainShadowColor: '#782F3C',
    //     secondaryColor: '#FFEBEF', // very pale pink
    //     secondaryShadowColor: '#49383B',
    //     inputBorderColor: '#FFB6C199',
    //     avatarTintColor: '#FFEBEF',
    //     avatarBorderColor: '#FFEBEF99',
    // },
};