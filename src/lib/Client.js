const request = require('request');
const User = require('./structures/User');
const { APIError, HTTPError } = require('./errors');

class Client {
    /**
     *
     * @param {string} token - API Token. Get yours from https://unbelievaboat.com/api/docs
     * @param {?Object} [options] - Options
     * @param {?string} [options.baseURL] - API hostname. Defaults to https://unbelievaboat.com/api
     * @param {?number} [options.version] - API version. Defaults to the latest version
     */
    constructor(token, options = {}) {
        if (!token) throw new Error('The API token must be specified');
        this.token = token;
        this.baseURL = options.baseURL ? options.baseURL : 'https://unbelievaboat.com/api';
        this.version = options.version !== undefined ? 'v' + options.version : '';
    }

    /**
     * Get a user's balance
     * @param guildId - Guild ID
     * @param userId - User ID
     * @returns {Promise<User>} User object
     */
    getUserBalance(guildId, userId) {
        if (!guildId) throw new Error('guildId must be specified');
        if (!userId) throw new Error('userId must be specified');
        return this._request('GET', `guilds/${guildId}/users/${userId}`)
            .then(data => new User(data));
    }

    /**
     * Set a user's balance to the given params
     * @param {string} guildId - Guild ID
     * @param {string} userId - User ID
     * @param {number|string} [cash] Value to set the cash balance to
     * @param {number|string} [bank] Value to set the bank balance to
     * @param {string} [reason] Reason for the audit log
     * @returns {Promise<User>} User object
     */
    setUserBalance(guildId, userId, { cash, bank } = {}, reason) {
        if (!guildId) throw new Error('guildId must be specified');
        if (!userId) throw new Error('userId must be specified');
        if (!cash && !bank) throw new Error('cash or bank must be specified');
        if (cash === Infinity) cash = 'Infinity';
        if (bank === Infinity) bank = 'Infinity';
        return this._request('PUT', `guilds/${guildId}/users/${userId}`, { cash, bank, reason })
            .then(data => new User(data));
    }

    /**
     * Increase or decrease a user's balance by the cash and bank values given.
     * Use negative values to decrease.
     * @param {string} guildId - Guild ID
     * @param {string} userId - User ID
     * @param {number|string} [cash] Value to increase/decrease the cash balance by
     * @param {number|string} [bank] Value to increase/decrease the bank balance by
     * @param {string} [reason] Reason for the audit log
     * @returns {Promise<User>}
     */
    editUserBalance(guildId, userId, { cash, bank } = {}, reason) {
        if (!guildId) throw new Error('guildId must be specified');
        if (!userId) throw new Error('userId must be specified');
        if (!cash && !bank) throw new Error('cash or bank must be specified');
        if (cash === Infinity) cash = 'Infinity';
        if (bank === Infinity) bank = 'Infinity';
        return this._request('PATCH', `guilds/${guildId}/users/${userId}`, { cash, bank, reason })
            .then(data => new User(data));
    }

    /**
     * Get a guild leaderboard
     * @param {string} guildId - Guild ID
     * @param {Object} [query] - Query string parameters (sort, limit, offset, page)
     * @returns {Promise<Array<User>|{ users: Array<User>, totalPages: number }>}
     */
    getGuildLeaderboard(guildId, query) {
        if (!guildId) throw new Error('guildId must be specified');
        return this._request('GET', `guilds/${guildId}/users`, {}, query)
            .then(data => {
                if (data.users) {
                    return {
                        users: data.users.map(user => new User(user)),
                        totalPages: data.total_pages
                    };
                } else {
                    return data.map(user => new User(user));
                }
            });
    }

    /**
     * Send a request
     * @param method - HTTP method (GET, PUT, PATCH etc.)
     * @param endpoint - API endpoint
     * @param [data] - JSON data
     * @param [query] - Query string
     * @returns {Promise<Object>}
     * @private
     */
    _request(method, endpoint, data = {}, query = {}) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    Authorization: this.token,
                    'Content-Type': 'application/json'
                },
                uri: `${this.baseURL}/${this.version ? `${this.version}/` : ''}${endpoint}`,
                method: method,
                json: data,
                qs: query
            };

            request(options, (err, res, body) => {
                if (err) {
                    return reject(err);
                }
                if (res.statusCode === 200) {
                    resolve(body);
                } else {
                    if (body && body.error) {
                        reject(new APIError(body.message, res.statusCode, body.errors));
                    } else {
                        reject(new HTTPError(res.statusMessage, res.statusCode));
                    }
                }
            });
        });
    }
}

module.exports = Client;
