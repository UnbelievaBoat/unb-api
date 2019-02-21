const request = require('request');
const User = require('./structures/User');

class Client {
    /**
     *
     * @param {string} token - API Token. Get yours from https://unbelievable.pizza/api/docs
     * @param {?object} [options] - Options
     * @param {?string} [options.baseURL] - API hostname. Defaults to https://unbelievable.pizza/api
     * @param {?number} [options.version] - API version. Defaults to the latest version
     */
    constructor(token, options = {}) {
        if (!token) throw new Error('The API token must be specified');
        this.token = token;
        this.baseURL = options.baseURL ? options.baseURL : 'https://unbelievable.pizza/api';
        this.version = options.version !== undefined ? 'v' + options.version : '';
    }

    /**
     * Get a user balance
     * @param guild_id - Guild ID
     * @param user_id - User ID
     * @returns {Promise<User>}
     */
    getUserBalance(guild_id, user_id) {
        if (!guild_id) throw new Error('guild_id must be specified');
        if (!user_id) throw new Error('user_id must be specified');
        return this._request('GET', `guilds/${guild_id}/users/${user_id}`)
            .then(data => new User(data));
    }


    /**
     * Set a user's balance to the given params
     * @param {string} guild_id - Guild ID
     * @param {string} user_id - User ID
     * @param {number|string} [cash] Value to set the cash balance to
     * @param {number|string} [bank] Value to set the bank balance to
     * @returns {Promise<User>}
     */
    setUserBalance(guild_id, user_id, { cash, bank }) {
        if (!guild_id) throw new Error('guild_id must be specified');
        if (!user_id) throw new Error('user_id must be specified');
        if (!cash && !bank) throw new Error('cash or bank must be specified');
        if (cash === Infinity) cash = 'Infinity';
        if (bank === Infinity) bank = 'Infinity';
        return this._request('PUT', `guilds/${guild_id}/users/${user_id}`, { cash, bank })
            .then(data => new User(data));
    }

    /**
     * Increase or decrease the User's balance by the cash and bank values given.
     * Use a negative number to decrease.
     * @param {string} guild_id - Guild ID
     * @param {string} user_id - User ID
     * @param {number|string} [cash] Value to increase/decrease the cash balance by
     * @param {number|string} [bank] Value to increase/decrease the bank balance by
     * @returns {Promise<User>}
     */
    editUserBalance(guild_id, user_id, { cash, bank }) {
        if (!guild_id) throw new Error('guild_id must be specified');
        if (!user_id) throw new Error('user_id must be specified');
        if (!cash && !bank) throw new Error('cash or bank must be specified');
        if (cash === Infinity) cash = 'Infinity';
        if (bank === Infinity) bank = 'Infinity';
        return this._request('PATCH', `guilds/${guild_id}/users/${user_id}`, { cash, bank })
            .then(data => new User(data));
    }


    /**
     * Get a guild leaderboard
     * @param guild_id - Guild ID
     * @returns {Promise<Array<User>>}
     */
    getGuildLeaderboard(guild_id) {
        if (!guild_id) throw new Error('guild_id must be specified');
        return this._request('GET', `guilds/${guild_id}/users`)
            .then(data => data.map(user => new User(user)));
    }


    /**
     * Send a request
     * @param method - HTTP method (GET, PUT, PATCH etc.)
     * @param endpoint - API endpoint
     * @param [data] - JSON data
     * @returns {Promise<Object>}
     * @private
     */
    _request(method, endpoint, data = {}) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: { Authorization: this.token, 'Content-Type': 'application/json' },
                uri: `${this.baseURL}/${this.version ? `${this.version} /` : ''}${endpoint}`,
                method: method,
                json: data
            };

            request(options, (err, res, body) => {
                if (err) return reject(err);
                if (res.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(new Error(body.error ? body.error : `${res.statusCode}: ${res.statusMessage}`));
                }
            });
        });
    }
}

module.exports = Client;
