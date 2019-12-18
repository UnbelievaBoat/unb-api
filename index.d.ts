declare module 'unb-api' {
    export const version: string;

    export class Client {
        public constructor(token: string, options?: Options);

        public token: string;
        public baseURL: string;
        public version: string;

        public getUserBalance(guild_id: string, user_id: string): Promise<User>;

        public setUserBalance(guild_id: string, user_id: string, balance: Balance): Promise<User>;

        public editUserBalance(guild_id: string, user_id: string, balance: Balance): Promise<User>;

        public getGuildLeaderboard(guild_id: string): Promise<User[]>;

        private _request(method: string, endpoint: string, data?: object): Promise<any>;
    }

    export class User {
        public constructor(data: object);

        public rank: number;
        public user_id: string;
        public cash: number;
        public bank: number;
        public total: number;

        private rawData: object;
    }

    export type Balance = {
        cash?: number,
        bank?: number
    }

    export type Options = {
        baseURL?: string;
        version?: number;
    }
}
