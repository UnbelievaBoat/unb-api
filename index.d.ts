declare module 'unb-api' {
    export const version: string;

    export class Client {
        public constructor(token: string, options?: Options);

        public token: string;
        public baseURL: string;
        public version: string;
        public maxRetries: number;

        public getUserBalance(guild_id: string, user_id: string): Promise<User>;

        public setUserBalance(guild_id: string, user_id: string, balance: Balance): Promise<User>;

        public editUserBalance(guild_id: string, user_id: string, balance: Balance): Promise<User>;

        public getGuildLeaderboard(guild_id: string, query?: object): Promise<User[]> | Promise<{ users: User[], totalPages: number }>;

        public getGuild(guild_id: string): Promise<Guild>;

        public getApplicationPermission(guild_id: string): Promise<Permission>;

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
        cash?: number | string,
        bank?: number | string
    }

    export type Options = {
        baseURL?: string;
        version?: number;
        maxRetries?: number;
    }

    export class Guild {
        public constructor(data: object);

        public id: string;
        public name: string;
        public icon: string;
        public iconURL: string;
        public ownerID: string;
        public memberCount: number;
        public currencySymbol: string;

        private rawData: object;
    }

    export class Permission {
        public constructor(allow: number);

        public allow: string;
        public json: string

        public has(permission: string | string[]): boolean;
    }
}
