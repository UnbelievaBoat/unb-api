# UnbelievaBoat API

[![Discord](https://discordapp.com/api/guilds/305129477627969547/embed.png)](https://discord.gg/unb)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/unb-api)
[![npm downloads](https://img.shields.io/npm/dt/unb-api.svg?maxAge=3600)](https://www.npmjs.com/package/unb-api)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM](https://nodei.co/npm/unb-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/unb-api/)

## Installation

`npm install unb-api`

## Documentation

Full API documentation is located at [https://unbelievaboat.com/api/docs](https://unbelievaboat.com/api/docs)

### Example

```javascript
const { Client } = require('unb-api');
const client = new Client('TOKEN');    // Get your API token from https://unbelievaboat.com/api/docs

const guildID = '305129477627969547';
const userID = '261674810914897931';

client.getUserBalance(guildID, userID).then(user => console.log(user));
client.getGuildLeaderboard(guildID, { sort: 'cash' }).then(lb => console.log(lb));
```

### Constructor

`new Client(token, [options])`

##### Options

| Type   | Property      | Description                                                                    |
|--------|---------------|--------------------------------------------------------------------------------|
| String | `baseURL?`    | API hostname. Defaults to https://unbelievaboat.com/api                        |
| Number | `version?`    | API version. Defaults to the latest version                                    |
| Number | `maxRetries?` | Maximum number of times to retry a request if it's rate-limited. Defaults to 3 |

### Methods

#### Economy

`getUserBalance(guildId: string, userId: string)`  
Returns: `Promise<User>`

`setUserBalance(guildId: string, userId: string, balance: Balance, reason?: string)`  
Returns: `Promise<User>`

`editUserBalance(guildId: string, userId: string, balance: Balance, reason?: string)`  
Returns: `Promise<User>`

`getGuildLeaderboard(guildId: string, query?: ListOptions)`  
Returns: `Promise<User[]> | Promise<{ users: User[], totalPages: number }>`
> [!NOTE]  
> If the query for `getGuildLeaderboard` includes a page parameter, the response will be an object containing both users and totalPages.  
> Otherwise, it will return a simple array of User[].

#### Generic

`getGuild(guildId: string)`  
Returns: `Promise<Guild>`

`getApplicationPermission(guildId: string)`  
Returns: `Promise<Permission>`

#### Items

`getItems(guildId: string, options?: ListOptions)`  
Returns: `Promise<{ page: number, totalPages: number, items: StoreItem[] }>`

`getItem(guildId: string, itemId: string)`  
Returns: `Promise<StoreItem>`

`createItem(guildId: string)`  
Returns: `Promise<StoreItem>`

`editItem(guildId: string, itemId: string, data: StoreItem | object, options?: { cascadeUpdate?: boolean })`  
Returns: `Promise<StoreItem>`

`deleteItem(guildId: string, itemId: string)`  
Returns: `Promise<any>`

`getInventoryItems(guildId: string, userId: string, options?: ListOptions)`  
Returns: `Promise<{ page: number, totalPages: number, items: InventoryItem[] }>`

`getInventoryItem(guildId: string, userId: string, itemId: string)`  
Returns: `Promise<InventoryItem>`

`addInventoryItem(guildId: string, userId: string, itemId: string, quantity?: string | number, options?: { inventoryUserId?: string })`  
Returns: `Promise<InventoryItem>`

`removeInventoryItem(guildId: string, userId: string, itemId: string, quantity?: string | number)`  
Returns: `Promise<any>`

##### ListOptions Parameters

| Type     | Property  |
|----------|-----------|
| String[] | `sort?`   |
| Number   | `limit?`  |
| Number   | `offset?` |
| Number   | `page?`   |

### Structures

#### User

| Type   | Property  | Description                                                                                      |
|--------|-----------|--------------------------------------------------------------------------------------------------|
| Number | `rank?`   | Leaderboard rank of the user. This is only present on getUserBalance() and getGuildLeaderboard() |
| String | `user_id` | User ID of the discord user.                                                                     |
| Number | `cash`    | User's cash balance.                                                                             |
| Number | `bank`    | User's bank balance.                                                                             |
| Number | `total`   | User's total balance.                                                                            |

#### Guild

| Type   | Property         | Description              |
|--------|------------------|--------------------------|
| String | `id`             | Guild ID.                |
| String | `name`           | Guild name.              |
| Number | `icon`           | Icon hash.               |
| Number | `iconURL`        | Icon url.                |
| String | `ownerID`        | User ID of the owner.    |
| Number | `memberCount`    | Total number of members. |
| String | `currencySymbol` | Currency symbol          |

#### StoreItem

| Type    | Property         | Description                                                               |
|---------|------------------|---------------------------------------------------------------------------|
| String  | `id`             | Unique ID of the item in the store.                                       |
| String  | `name`           | Name of the item.                                                         |
| String  | `description?`   | Description of the item.                                                  |
| Number  | `price`          | Price of the item.                                                        |
| Number  | `stockRemaining` | Amount of stock remaining for the item.                                   |
| Boolean | `unlimitedStock` | Whether the item has unlimited stock.                                     |
| Boolean | `isInventory`    | Indicates if the item will be added to a user’s inventory when purchased. |
| Date    | `expiresAt?`     | Expiration date of the item.                                              |
| Boolean | `isUsable`       | Whether the item can be used by the user.                                 |
| Boolean | `isSellable`     | Whether the item can be sold by the user.                                 |
| Array   | `requirements`   | Requirements needed to purchase the item.                                 |
| Array   | `actions`        | Actions performed when the item is used.                                  |
| String  | `emojiUnicode?`  | Unicode emoji associated with the item.                                   |
| String  | `emojiId?`       | Custom emoji ID associated with the item.                                 |

#### InventoryItem

| Type                                            | Property        | Description                                   |
|-------------------------------------------------|-----------------|-----------------------------------------------|
| String                                          | `itemId`        | Unique ID of the item in the inventory.       |
| Number                                          | `quantity`      | Quantity of the item in the user's inventory. |
| String                                          | `name`          | Name of the item.                             |
| String                                          | `description?`  | Description of the item.                      |
| Boolean                                         | `isUsable`      | Whether the item can be used by the user.     |
| Boolean                                         | `isSellable`    | Whether the item can be sold by the user.     |
| [StoreItemRequirement[]](#StoreItemRequirement) | `requirements`  | Requirements needed to use the item.          |
| [StoreItemAction[]](#StoreItemAction)           | `actions`       | Actions performed when the item is used.      |
| String                                          | `emojiUnicode?` | Unicode emoji associated with the item.       |
| String                                          | `emojiId?`      | Custom emoji ID associated with the item.     |

#### StoreItemRequirement

| Type                          | Property    | Description                                                                           |
|-------------------------------|-------------|---------------------------------------------------------------------------------------|
| StoreItemRequirementType      | `type`      | Type of requirement. Could be one of `ROLE`, `TOTAL_BALANCE`, or `ITEM`.              |
| StoreItemRequirementMatchType | `matchType` | Specifies how the requirement must be met. Can be `EVERY`, `AT_LEAST_ONE`, or `NONE`. |
| String[]                      | `ids`       | An array of IDs that correspond to roles, items, or other required entities.          |
| Number                        | `balance`   | Minimum balance required (applicable if `type` is `TOTAL_BALANCE`).                   |

#### StoreItemAction

| Type                | Property   | Description                                                                                                                              |
|---------------------|------------|------------------------------------------------------------------------------------------------------------------------------------------|
| StoreItemActionType | `type`     | Type of action. Could be one of `RESPOND`, `ADD_ROLES`, `REMOVE_ROLES`, `ADD_BALANCE`, `REMOVE_BALANCE`, `ADD_ITEMS`, or `REMOVE_ITEMS`. |
| String[]            | `ids`      | An array of IDs corresponding to roles, items, or other entities involved in the action.                                                 |
| Object              | `message?` | Discord message object, only applicable if `type` is `RESPOND`.                                                                          |
| Number              | `balance?` | Balance amount to be added or removed (applicable if `type` is `ADD_BALANCE` or `REMOVE_BALANCE`).                                       |

#### Permission

| Type   | Property | Description                                                |
|--------|----------|------------------------------------------------------------|
| Number | `allow`  | The allowed bitwise permissions number.                    |
| String | `json`   | JSON representation of the allowed and denied permissions. |

## Support

[**Discord Server**](https://discord.gg/unb)
