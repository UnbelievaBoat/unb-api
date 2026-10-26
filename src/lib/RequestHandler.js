const Bucket = require('./util/Bucket');
const { APIError, HTTPError } = require('./errors');
const MajorParams = ['guilds'];

class RequestHandler {
    constructor(client) {
        this._client = client;
        this.ratelimits = {};
    }

    async request(method, endpoint, data = {}, params = {}, _attempts = 0) {
        const route = this.getRoute(method, endpoint);
        if (!this.ratelimits[route]) {
            this.ratelimits[route] = new Bucket();
        }

        return new Promise((resolve, reject) => {
            const fn = async (callback) => {
                const options = {
                    method,
                    url: `/${this._client.version ? `${this._client.version}/` : ''}${endpoint}`,
                    data,
                    params,
                };

                try {
                    const { data: responseData, status, statusText, headers } = await this.fetch(options);

                    // Increase the number of attempts
                    ++_attempts;

                    // Add the rate limit header data to the bucket
                    this.parseRateLimitHeaders(route, headers);

                    if (status >= 200 && status < 300) {
                        resolve(responseData);
                    } else if (status === 429) {
                        if (_attempts >= this._client.maxRetries) {
                            this.rejectWithError(options, responseData, status, statusText, reject);
                        } else {
                            this.retryRequest(method, endpoint, data, params, _attempts, headers, resolve, reject);
                        }
                    } else {
                        this.rejectWithError(options, responseData, status, statusText, reject);
                    }

                    callback();
                } catch (error) {
                    reject(error);
                    callback();
                }
            };

            this.ratelimits[route].queue(fn);
        });
    }

    async fetch(options) {
        const url = new URL(`${this._client.baseURL.replace(/\/+$/, '')}${options.url}`);
        for (const [key, value] of Object.entries(options.params || {})) {
            if (value === undefined || value === null) continue;
            if (Array.isArray(value)) {
                for (const v of value) url.searchParams.append(`${key}[]`, v);
            } else {
                url.searchParams.append(key, value);
            }
        }

        const response = await fetch(url, {
            method: options.method,
            headers: {
                'Authorization': this._client.token,
                'Content-Type': 'application/json'
            },
            body: ['GET', 'HEAD'].includes(options.method) ? undefined : JSON.stringify(options.data)
        });

        const text = await response.text();
        let data = text;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                // Not JSON (e.g. an HTML error page from a proxy), keep the raw text
            }
        }

        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers)
        };
    }

    rejectWithError(options, data, status, statusText, reject) {
        if (data && data.message) {
            reject(new APIError(options, { data, status, statusText }));
        } else {
            reject(new HTTPError(options, { data, status, statusText }));
        }
    }

    retryRequest(method, endpoint, data, params, _attempts, headers, resolve, reject) {
        const retryAfter = headers['retry-after'] ? +headers['retry-after'] : 0;

        setTimeout(() => {
            this.request(method, endpoint, data, params, _attempts)
                .then(resolve)
                .catch(reject);
        }, retryAfter);
    }

    getRoute(method, endpoint) {
        const route = endpoint.replace(/\/([a-z-]+)\/(\d+)/g, (match, p) => {
            return MajorParams.includes(p) ? match : `/${p}/:id`;
        });
        return `${method}/${route}`;
    }

    parseRateLimitHeaders(route, headers) {
        const now = Date.now();

        if (headers['x-ratelimit-limit']) {
            this.ratelimits[route].limit = +headers['x-ratelimit-limit'];
        }

        if (headers['x-ratelimit-remaining'] === undefined) {
            this.ratelimits[route].remaining = 1;
        } else {
            this.ratelimits[route].remaining = +headers['x-ratelimit-remaining'] || 0;
        }

        if (headers['retry-after']) {
            this.ratelimits[route].reset = (+headers['retry-after'] || 1) + now;
        } else if (headers['x-ratelimit-reset']) {
            this.ratelimits[route].reset = Math.max(+headers['x-ratelimit-reset'], now);
        } else {
            this.ratelimits[route].reset = now;
        }
    }
}

module.exports = RequestHandler;
