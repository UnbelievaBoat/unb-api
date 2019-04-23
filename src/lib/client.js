const got = require('got');
const User = require('./structures/User');

class UnbelievaboatAPIClient {
    /**
     *
     * @param {string} token - API Token. Get yours from https://unbelievable.pizza/api/docs
     * @param {?object} [options] - Options
     * @param {?string} [options.baseURL] - API hostname. Defaults to https://unbelievable.pizza/api
     * @param {?number} [options.version] - API version. Defaults to the latest version
	 * @param {?boolean} [options.waitForRatelimit] - Wait for ratelimits in API calls.
     */
	constructor(token, options = {}) {
		if (!token)
			throw new Error('The API token must be specified');

		/**
		 * Token used to authorize API calls.
		 * @type {string}
		 */
		this.token = String(token);

		/**
		 * API version accessed by the client.
		 * @type {number}
		 */
		this.version = Number(options.version) || 1;

		/**
		 * Base URL for requests made to the API.
		 * @type {string}
		 */
		this.baseURL = options.baseURL ? String(options.baseURL) : `https://unbelievable.pizza/api/v${this.version}`;

		/**
		 * Option to wait for ratelimits while making requests.
		 * @type {boolean}
		 */
		this.waitForRatelimit = Boolean(options.waitForRatelimit);
	}

	/**
	 * Sleep for a given amount of time.
	 * @param {number} ms Milliseconds to sleep for
	 * @returns Resolved promise after sleeping for the given time
	 * @private
	 */
	async _sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Check if a given ID is valid.
	 * Discord IDs are usually in the range of 17 to 18 digits.
	 * To be safe, we use a range of 15 to 20 digits.
	 * Numeric IDs can cause loss of precision so we utilise strings.
	 * @param {string} id ID to validate
	 * @returns {boolean} Whether the ID is valid or not
	 * @private
	 */
	_isValidId(id) {
		return typeof id === "string" && /^\d{15,20}$/m.test(id);
	}

    /**
     * Get the balance of a user.
     * @param {string} guildId Guild ID
     * @param {string} userId User ID
     * @returns {User} User object.
     */
	async getUserBalance(guildId, userId) {
		if (!guildId)
			throw new Error('guildId must be specified.');
		if (!this._isValidId(guildId))
			throw new Error('Invalid guildId specified.');
		if (!userId)
			throw new Error('userId must be specified.');
		if (!this._isValidId(userId))
			throw new Error('Invalid userId specified.');
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
     * @returns {Promise<User>} User object.
     */
	async setUserBalance(guildId, userId, { cash, bank } = {}, reason = '') {
		if (!guildId)
			throw new Error('guildId must be specified.');
		if (!this._isValidId(guildId))
			throw new Error('Invalid guildId specified.');
		if (!userId)
			throw new Error('userId must be specified.');
		if (!this._isValidId(userId))
			throw new Error('Invalid userId specified.');
		if (!cash && !bank)
			throw new Error('cash or bank must be specified');
		if (cash === Infinity)
			cash = 'Infinity';
		if (bank === Infinity)
			bank = 'Infinity';
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
     * @returns {Promise<User>} User object.
     */
	async editUserBalance(guildId, userId, { cash, bank } = {}, reason = '') {
		if (!guildId)
			throw new Error('guildId must be specified.');
		if (!this._isValidId(guildId))
			throw new Error('Invalid guildId specified.');
		if (!userId)
			throw new Error('userId must be specified.');
		if (!this._isValidId(userId))
			throw new Error('Invalid userId specified.');
		if (!cash && !bank)
			throw new Error('cash or bank must be specified');
		if (cash === Infinity)
			cash = 'Infinity';
		if (bank === Infinity)
			bank = 'Infinity';
		return this._request('PATCH', `guilds/${guildId}/users/${userId}`, { cash, bank, reason })
			.then(data => new User(data));
	}


    /**
     * Get the leaderboard of a particular guild.
     * @param guildId - Guild ID
     * @returns {Promise<Array<User>>} Leaderboard of the guild.
     */
	async getGuildLeaderboard(guildId) {
		if (!guildId)
			throw new Error('guildId must be specified.');
		if (!this._isValidId(guildId))
			throw new Error('Invalid guildId specified.');
		return this._request('GET', `guilds/${guildId}/users`)
			.then(data => data.map(user => new User(user)));
	}


    /**
     * Send a request to the API.
     * @param method - HTTP method (GET, PUT, PATCH etc.)
     * @param endpoint - API endpoint
     * @param [data] - JSON data
     * @returns {Promise<Object>} Parsed response from the API
     * @private
     */
	async _request(method, endpoint, data = {}) {
		let response = null;

		// use a loop to enable subsequent requests if the first one gets ratelimited
		while (!response) {
			response = await got(endpoint, {
				baseUrl: this.baseURL,
				headers: { Authorization: this.token },
				json: data, method, retry: 0, throwHttpErrors: false
			});

			if (response.statusCode === 200) {
				console.count("success");
				return response.body;
			}

			else if (response.statusCode === 429 && this.waitForRatelimit) {
				await this._sleep(response.body.retry_after);
				response = null;
				continue;
			}

			else if (response.body & response.body.error)
				throw new Error(`${response.body.error} - ${response.body.message}`);

			else throw new Error(`${response.statusCode} - ${response.statusMessage}`);
		}
	}
}

module.exports = UnbelievaboatAPIClient;
