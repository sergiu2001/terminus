export class Profile {
    
    constructor(
        public id: string,
        public username: string,
        public money: number,
        public tokens: number
    ) {

        this.id = id;
        this.username = username;
        this.money = money;
        this.tokens = tokens;
    }

    getProfileInfo() {
        return {
            id: this.id,
            username: this.username,
            money: this.money,
            tokens: this.tokens
        };
    }

}
