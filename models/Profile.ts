export class Profile {
    constructor(
        public id: string,
        public username: string,
        public money: number,
        public tokens: number,
        public updatedAt?: number
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
        return { ...this.getProfileInfo(), updatedAt: this.updatedAt ?? Date.now() };
    }

    static fromObject(obj: any) {
        return new Profile(obj.id, obj.username, obj.money, obj.tokens, obj.updatedAt);
    }
}
