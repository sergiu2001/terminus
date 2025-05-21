import { downloadAvatars } from "@/services/firebaseStorageService";
import { StrategistItem } from "./StrategistItem";

const defaultStrategistItems : { [key: string]: StrategistItem } = {
    'mustacheF':{
        strategistName: 'mustacheF',
        strategistUrl: '',
        strategistDescription: 'A man with a mustache',
        strategistCost: 450,
        strategistLocked: false,
        strategistSelected: true,
    },
    // 'aramus':{
    //     strategistName: 'aramus',
    //     strategistUrl: '',
    //     strategistDescription: '',
    //     strategistCost: 450,
    //     strategistLocked: true,
    //     strategistSelected: false,
    // },
    // 'koll':{
    //     strategistName: 'koll',
    //     strategistUrl: '',
    //     strategistDescription: '',
    //     strategistCost: 450,
    //     strategistLocked: true,
    //     strategistSelected: false,
    // },
    // 'maximus':{
    //     strategistName: 'maximus',
    //     strategistUrl: '',
    //     strategistDescription: '',
    //     strategistCost: 450,
    //     strategistLocked: true,
    //     strategistSelected: false,
    // },
    // 'thetra':{
    //     strategistName: 'thetra',
    //     strategistUrl: '',
    //     strategistDescription: '',
    //     strategistCost: 450,
    //     strategistLocked: true,
    //     strategistSelected: false,
    // },
    // 'vik':{
    //     strategistName: 'vik',
    //     strategistUrl: '',
    //     strategistDescription: '',
    //     strategistCost: 450,
    //     strategistLocked: true,
    //     strategistSelected: false,
    // }
};

export const createStrategistItems = async (): Promise<StrategistItem[]> => {
    try {
        const strategistUrlsArray = await downloadAvatars();
        const strategistUrls = strategistUrlsArray.reduce((acc, [url, name]) => {
            acc[name] = url;
            return acc;
        }, {} as Record<string, string>);
    
        const strategistItems = Object.entries(defaultStrategistItems).map(([key, item]) => ({
            ...item,
            strategistUrl: strategistUrls[key] || ''
        }));
        
        return strategistItems;
    } catch (error) {
        console.error('Error creating strategist object:', error);
        return [];
    }
}