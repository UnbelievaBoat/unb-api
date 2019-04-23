# UnbelievaBoat API

[![Discord](https://discordapp.com/api/guilds/305129477627969547/embed.png)](https://discord.gg/YMJ2dGp)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/unb-api)
[![npm downloads](https://img.shields.io/npm/dt/unb-api.svg?maxAge=3600)](https://www.npmjs.com/package/unb-api)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM](https://nodei.co/npm/unb-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/unb-api/)

## Installation
`npm install unb-api`

## Documentation
Full API documentation is located at [https://unbelievable.pizza/api/docs](https://unbelievable.pizza/api/docs)

### Example
```javascript
const { Client } = require('unb-api');
const client = new Client('TOKEN');    // Get your API token from https://unbelievable.pizza/api/docs

const guildID = '305129477627969547';
const userID = '261674810914897931';

client.getUserBalance(guildID, userID).then(user => console.log(user));
```

### Constructor
`new Client(token, [options])`

### Methods
```
getUserBalance(guildId, userId)
```
Returns: `Promise<User>`
#
```
setUserBalance(guildId, userId, { cash, bank }, reason)
```
Returns: `Promise<User>`
#
```
editUserBalance(guildId, userId, { cash, bank }, reason)
```
Returns: `Promise<User>`
#
```
getGuildLeaderboard(guildId)
```
Returns: `Promise<User[]>`
#

### Structures
#### User
Type | Property | Description
--- | --- | ---
Number | `rank?` | Leaderboard rank of the user. This is only present on getUserBalance() and getGuildLeaderboard()
String | `id` | ID of the discord user.
Number | `cash` | User's cash balance.
Number | `bank` | User's bank balance.
Number | `total` | User's total balance.



## Support
[**Discord Server**](https://discord.gg/YMJ2dGp)