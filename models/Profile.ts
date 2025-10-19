export class Profile {
    constructor(
        public id: string,
        public username: string,
        public money: number,
        public tokens: number,
        public updatedAt?: number,
        public version: number = 0
    ) {}

    getProfileInfo() {
        return {
            id: this.id,
            username: this.username,
            money: this.money,
            tokens: this.tokens,
        };
    }

    toSnapshot() {
        return { ...this.getProfileInfo(), updatedAt: this.updatedAt ?? Date.now(), version: this.version };
    }

    static fromObject(obj: any) {
        return new Profile(obj.id, obj.username, obj.money, obj.tokens, obj.updatedAt, obj.version ?? 0);
    }

    withBalances(deltaMoney: number, deltaTokens: number) {
        const nextMoney = Math.max(0, (this.money ?? 0) + (deltaMoney ?? 0));
        const nextTokens = Math.max(0, (this.tokens ?? 0) + (deltaTokens ?? 0));
        return new Profile(this.id, this.username, nextMoney, nextTokens, Date.now(), (this.version ?? 0) + 1);
    }
}
