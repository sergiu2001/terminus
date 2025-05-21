export class StrategistItem {
    strategistName: string;
    strategistUrl: string;
    strategistDescription: string;
    strategistCost: number;
    strategistLocked: boolean;
    strategistSelected: boolean;
    
    constructor(
        strategistName: string,
        strategistUrl: string,
        strategistDescription: string,
        strategistCost: number,
        strategistLocked: boolean,
        strategistSelected: boolean,
    ) {
        this.strategistName = strategistName;
        this.strategistUrl = strategistUrl;
        this.strategistDescription = strategistDescription;
        this.strategistCost = strategistCost;
        this.strategistLocked = strategistLocked;
        this.strategistSelected = strategistSelected;
    }
}