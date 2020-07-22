# UnbelievaBoat API

[![Discord](https://discordapp.com/api/guilds/305129477627969547/embed.png)](https://discord.gg/YMJ2dGp)
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
Type    |  Property     | Description
------- | ---------     | -----------
String  | `baseURL?`    | API hostname. Defaults to https://unbelievaboat.com/api
Number  | `version?`    | API version. Defaults to the latest version
Number  | `maxRetries?` | Maximum number of times to retry a request if it's ratelimited. Defaults to 3


### Methods
```
getUserBalance(guild_id, user_id)
```
Returns: `Promise<User>`
#
```
setUserBalance(guild_id, user_id, { cash, bank }, reason)
```
Returns: `Promise<User>`
#
```
editUserBalance(guild_id, user_id, { cash, bank }, reason)
```
Returns: `Promise<User>`
#
```
getGuildLeaderboard(guild_id, [query])
```

##### JSON Query Parameters
Type    |  Property | Description
------- | --------- | -----------
String  | `sort?`   | Sort the leaderboard by `cash`, `bank` or `total`. Default is `total`.
Number  | `limit?`  | Limit the number of users returned. Default is no limit, unless a page is given then it's 1000.
Number  | `offset?` | Specify the offset of the first user.
Number  | `page?`   | Specify the page. If a page is given, the response will be `Promise<{ users: User[], totalPages: Number }>`

Returns: `Promise<User[]>`
#
```
getGuild(guild_id)
```
Returns: `Promise<Guild>`
#
```
getApplicationPermission(guild_id)
```
Returns: `Promise<Permission>`

### Structures
#### User
Type | Property | Description
--- | --- | ---
Number | `rank?` | Leaderboard rank of the user. This is only present on getUserBalance() and getGuildLeaderboard()
String | `user_id` | User ID of the discord user.
Number | `cash` | User's cash balance.
Number | `bank` | User's bank balance.
Number | `total` | User's total balance.
 
#### Guild
Type | Property | Description
--- | --- | ---
String | `id` | Guild ID.
String | `name` | Guild name.
Number | `icon` | Icon hash.
Number | `iconURL` | Icon url.
String | `ownerID` | User ID of the owner.
Number | `memberCount` | Total number of members.
String | `currencySymbol` | Currency symbol


#### Permission
Type | Property | Description
--- | --- | ---
Number | `allow` | The allowed bitwise permissions number.
String | `json` | JSON representation of the allowed and denied permissions.


## Support
[**Discord Server**](https://discord.gg/YMJ2dGp)
