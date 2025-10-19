export interface ProfileStats {
    contractsCompleted: number;
    contractsFailed: number;
    totalEarnings: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
}

export class Profile {
    constructor(
        public id: string,
        public username: string,
        public money: number,
        public tokens: number,
        public updatedAt?: number,
        public version: number = 0,
        public stats?: ProfileStats
    ) {
        // Initialize stats if not provided
        if (!stats) {
            this.stats = {
                contractsCompleted: 0,
                contractsFailed: 0,
                totalEarnings: 0,
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
            };
        }
    }

    getProfileInfo() {
        return {
            id: this.id,
            username: this.username,
            money: this.money,
            tokens: this.tokens,
            stats: this.stats,
        };
    }

    toSnapshot() {
        return { 
            ...this.getProfileInfo(), 
            updatedAt: this.updatedAt ?? Date.now(), 
            version: this.version 
        };
    }

    static fromObject(obj: any) {
        return new Profile(
            obj.id, 
            obj.username, 
            obj.money, 
            obj.tokens, 
            obj.updatedAt, 
            obj.version ?? 0,
            obj.stats
        );
    }

    withBalances(deltaMoney: number, deltaTokens: number) {
        const nextMoney = Math.max(0, (this.money ?? 0) + (deltaMoney ?? 0));
        const nextTokens = Math.max(0, (this.tokens ?? 0) + (deltaTokens ?? 0));
        
        // Track total earnings
        const stats = { ...this.stats! };
        if (deltaMoney > 0) {
            stats.totalEarnings = (stats.totalEarnings ?? 0) + deltaMoney;
        }
        
        return new Profile(
            this.id, 
            this.username, 
            nextMoney, 
            nextTokens, 
            Date.now(), 
            (this.version ?? 0) + 1,
            stats
        );
    }

    withContractCompleted(xpGained: number = 0) {
        const stats = { ...this.stats! };
        stats.contractsCompleted = (stats.contractsCompleted ?? 0) + 1;
        
        // Add XP and check for level up
        stats.xp = (stats.xp ?? 0) + xpGained;
        while (stats.xp >= stats.xpToNextLevel) {
            stats.xp -= stats.xpToNextLevel;
            stats.level = (stats.level ?? 1) + 1;
            stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.5); // Exponential growth
        }
        
        return new Profile(
            this.id,
            this.username,
            this.money,
            this.tokens,
            Date.now(),
            (this.version ?? 0) + 1,
            stats
        );
    }

    withContractFailed() {
        const stats = { ...this.stats! };
        stats.contractsFailed = (stats.contractsFailed ?? 0) + 1;
        
        return new Profile(
            this.id,
            this.username,
            this.money,
            this.tokens,
            Date.now(),
            (this.version ?? 0) + 1,
            stats
        );
    }

    getWinRate(): number {
        const total = (this.stats?.contractsCompleted ?? 0) + (this.stats?.contractsFailed ?? 0);
        if (total === 0) return 0;
        return Math.round(((this.stats?.contractsCompleted ?? 0) / total) * 100);
    }
}
