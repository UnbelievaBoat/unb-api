declare module 'unb-api' {
    export const version: string;

    export class Client {
        public constructor(token: string, options?: Options);

        public token: string;
        public baseURL: string;
        public version: string;
        public maxRetries: number;

        public getUserBalance(guildId: string, userId: string): Promise<User>;

        public setUserBalance(guildId: string, userId: string, balance: Balance, reason?: string): Promise<User>;

        public editUserBalance(guildId: string, userId: string, balance: Balance, reason?: string): Promise<User>;

        public getGuildLeaderboard(guildId: string, query?: object): Promise<User[]> | Promise<{ users: User[], totalPages: number }>;

        public getGuild(guildId: string): Promise<Guild>;

        public getApplicationPermission(guildId: string): Promise<Permission>;


        public getItems(guildId: string, options?: ItemListOptions): Promise<{ page: number, totalPages: number, items: StoreItem[] }>

        public getItem(guildId: string, itemId: string): Promise<StoreItem>

        public editItem(guildId: string, itemId: string, data: StoreItem | object, options?: { cascadeUpdate?: boolean }): Promise<StoreItem>

        public deleteItem(guildId: string, itemId: string): Promise<any>


        public getInventoryItems(guildId: string, userId: string, options?: ItemListOptions): Promise<{ page: number, totalPages: number, items: InventoryItem[] }>

        public getInventoryItem(guildId: string, userId: string, itemId: string): Promise<InventoryItem>

        public addInventoryItem(guildId: string, userId: string, itemId: string, quantity?: string | number, options?: { inventoryUserId?: string }): Promise<InventoryItem>

        public removeInventoryItem(guildId: string, userId: string, itemId: string, quantity?: string | number): Promise<any>


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
        public json: string;

        public has(permission: string | string[]): boolean;
    }

    export class BaseItem {
        public constructor(data: object);

        public name: string;
        public description?: string;
        public isUsable: boolean;
        public isSellable: boolean;
        public requirements: StoreItemRequirement[];
        public actions: StoreItemAction[];
        public emojiUnicode?: string;
        public emojiId?: string;
    }

    export class StoreItem extends BaseItem {
        public constructor(data: object);

        public id: string;
        public price: number;
        public stockRemaining: number;
        public unlimitedStock: boolean;
        public isInventory: boolean;
        public expiresAt?: Date;
    }

    export class InventoryItem extends BaseItem {
        public itemId: string;
        public quantity: number;
    }

    enum StoreItemRequirementType {
        REQUIREMENT_TYPE_UNKNOWN,
        ROLE,
        TOTAL_BALANCE,
        ITEM,
    }

    enum StoreItemRequirementMatchType {
        MATCH_TYPE_UNKNOWN,
        EVERY,
        AT_LEAST_ONE,
        NONE,
    }

    enum StoreItemActionType {
        ACTION_TYPE_UNKNOWN,
        RESPOND,
        ADD_ROLES,
        REMOVE_ROLES,
        ADD_BALANCE,
        REMOVE_BALANCE,
        ADD_ITEMS,
        REMOVE_ITEMS,
    }
    
    export class StoreItemRequirement {
        type: StoreItemRequirementType;
        matchType: StoreItemRequirementMatchType;
        ids: string[];
        balance: number;
    }

    export class StoreItemAction {
        type: StoreItemActionType;
        ids: string[];
        message: object;    //  discord message object
        balance: number;
    }

    export type ItemListOptions = {
        limit: number;
        page: number;
        sort: string[]
        query: string;
    }
}
