const { Guild, Permission, User } = require('./structures');
const RequestHandler = require('./RequestHandler');

class Client {
	/**
	 *
	 * @constructs Client
	 * @param {string} token - Your api token. You may get one from https://unbelievaboat.com/api/docs.
	 * @param {object} [options={}] - The options for the api client.
	 * @param {string} [options.baseURL="https://unbelievaboat.com/api"] - The api hostname to use. Defaults to https://unbelievaboat.com/api.
	 * @param {number} [options.version=""] - The api version to use. Defaults to the latest version.
	 * @param {number} [options.maxRetries=3] - The maximum number of times to retry a request if it's ratelimited. Defaults to 3.
	 * @throws {TypeError}
	 */
	constructor(token, options = {}) {
		if (typeof token !== 'string') throw new TypeError('The API token must be a string');
		if (typeof options !== 'object') throw new TypeError('options must be an object');
		if (options.baseURL !== undefined && typeof options.baseURL !== 'string') throw new TypeError('baseURL must be a string');
		if (options.version !== undefined && typeof options.version !== 'number') throw new TypeError('version must be a number');
		if (options.maxRetries !== undefined && typeof options.maxRetries !== 'number') throw new TypeError('maxRetries must be a number');

		this.token = token;
		this.baseURL = options.baseURL ? options.baseURL : 'https://unbelievaboat.com/api';
		this.version = options.version !== undefined ? 'v' + options.version : '';
		this.maxRetries = options.maxRetries || 3;
		this.requestHandler = new RequestHandler(this);
	}

	/**
	 * Get a users balance.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to get from.
	 * @param {string} userId - The user id to get.
	 * @throws {TypeError}
	 * @returns {Promise<User>} User object.
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#get-user-balance|Get User Balance}
	 */
	getUserBalance(guildId, userId) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');
	if (typeof userId !== 'string') throw new TypeError('userId must be a string');

		return this._request('GET', `guilds/${guildId}/users/${userId}`)
			.then(data => new User(data));
	}

	/**
	 * Set a users balance to the provided values.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to use.
	 * @param {string} userId - The user id to set the balance of.
	 * @param {object} [data={}] - The balance options to set the users balance to.
	 * @param {number | string} [data.cash] - The value to set the users cash balance to.
	 * @param {number | string} [data.bank] - The value to set the users bank balance to.
	 * @param {string} [reason] - The reason for changing the users balance to show in the audit log.
	 * @throws {Error | TypeError}
	 * @returns {Promise<User>} The updated user object.
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#put-user-balance|Put User Balance}
	 */
	setUserBalance(guildId, userId, data = {}, reason) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');
		if (typeof userId !== 'string') throw new TypeError('userId must be a string');
		if (typeof data !== 'object' || (data.cash === undefined && data.bank === undefined)) throw new Error('either cash or bank must be specified');
		if (data.cash !== undefined && ((typeof data.cash !== 'number' && typeof data.cash !== 'string') || isNaN(data.cash))) throw new TypeError('cash must be a string or number');
		if (data.bank !== undefined && ((typeof data.bank !== 'number' && typeof data.bank !== 'string') || isNaN(data.bank))) throw new TypeError('bank must be a string or number');
		if (data.cash === Infinity) data.cash = 'Infinity';
		if (data.bank === Infinity) data.bank = 'Infinity';

		return this._request('PUT', `guilds/${guildId}/users/${userId}`, { cash: data.cash, bank: data.bank, reason })
			.then(data => new User(data));
	}

	/**
	 * Increase or decrease a users balance by the cash and bank values given.
	 * Use negative values to decrease.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to use.
	 * @param {string} userId - The user id to modify the balance of.
	 * @param {object} [data={}] - The balance options to increase/decrease the users balance by.
	 * @param {number | string} [data.cash] - The amount to increase/decrease the users cash balance by.
	 * @param {number | string} [data.bank] - The amount to increase/decrease the users bank balance by.
	 * @param {string} [reason] - The reason for changing the users balance to show in the audit log.
	 * @throws {Error | TypeError}
	 * @returns {Promise<User>} The updated user object.
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#patch-user-balance|Patch User Balance}
	 */
	editUserBalance(guildId, userId, data = {}, reason) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');
		if (typeof userId !== 'string') throw new TypeError('userId must be a string');
		if (typeof data !== 'object' || (data.cash === undefined && data.bank === undefined)) throw new Error('either cash or bank must be specified');
		if (data.cash !== undefined && ((typeof data.cash !== 'number' && typeof data.cash !== 'string') || isNaN(data.cash))) throw new TypeError('cash must be a string or number');
		if (data.bank !== undefined && ((typeof data.bank !== 'number' && typeof data.bank !== 'string') || isNaN(data.bank))) throw new TypeError('bank must be a string or number');
		if (data.cash === Infinity) data.cash = 'Infinity';
		if (data.bank === Infinity) data.bank = 'Infinity';

		return this._request('PATCH', `guilds/${guildId}/users/${userId}`, { cash: data.cash, bank: data.bank, reason })
			.then(data => new User(data));
	}

	/**
	 * Get the leaderboard for a guild.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to get the leaderboard for.
	 * @param {object} [query={}] - The query string parameters (sort, limit, offset, page).
	 * @param {'total' | 'cash' | 'bank'} [query.sort] - The value to sort the leaderboard by.
	 * @param {number} [query.limit] - The limit of items to return.
	 * @param {number} [query.offset] - The index at which to start retrieving items from the leaderboard.
	 * @param {number} [query.page] - The page to get items from. If provided the return value will be `{ users: Array, totalPages: Number }`.
	 * @throws {TypeError}
	 * @returns {Promise<User[] | { users: User[], totalPages: number }>} The leaderboard data.
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#get-guild-leaderboard|Get Guild Leaderboard}
	 */
	getGuildLeaderboard(guildId, query = {}) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');
		if (typeof query !== 'object') throw new TypeError('query must be an object');
		if (query.sort !== undefined && !['total', 'cash', 'bank'].includes(query.sort)) throw new TypeError('sort must be one of total, cash or bank');
		if (query.limit !== undefined && typeof query.limit !== 'number') throw new TypeError('limit must be a number');
		if (query.offset !== undefined && typeof query.offset !== 'number') throw new TypeError('offset must be a number');
		if (query.page !== undefined && typeof query.page !== 'number') throw new TypeError('page must be a number');

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
	 * Retrieve basic information for a guild.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to get basic information of.
	 * @throws {TypeError}
	 * @returns {Promise<Guild>}
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#get-guild|Get Guild}
	 */
	getGuild(guildId) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');

		return this._request('GET', `guilds/${guildId}`)
			.then(data => new Guild(data));
	}

	/**
	 * Retrieve the permissions for the application.
	 * This can only be used with an application API token.
	 * 
	 * @public
	 * @param {string} guildId - The guild id to get the permissions for the application from.
	 * @throws {TypeError}
	 * @returns {Promise<Permission>} The permissions object for the application.
	 * 
	 * @see {@link https://unbelievaboat.com/api/docs#get-application-permissions|Get Application Permissions}
	 */
	getApplicationPermission(guildId) {
		if (typeof guildId !== 'string') throw new TypeError('guildId must be a string');

		return this._request('GET', `applications/@me/guilds/${guildId}`)
			.then(data => new Permission(data.permissions));
	}

	/**
	 * Send a request.
	 * 
	 * @private
	 * @param {Method} method - The http method to use (GET, PUT, PATCH etc.).
	 * @param {string} endpoint - The api endpoint to request.
	 * @param {object} [data={}] - The data to provide provide to the server.
	 * @param {object} [query={}] - The query string options to use in the url.
	 * @returns {Promise<any>} The raw request data.
	 */
	_request(method, endpoint, data = {}, query = {}) {
		return this.requestHandler.request(method, endpoint, data, query);
	}
}

module.exports = Client;
