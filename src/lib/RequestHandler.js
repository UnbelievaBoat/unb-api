const axios = require('axios');
const Bucket = require('./structures/Bucket');
const { APIError, HTTPError } = require('./errors');
const MajorParams = ['guilds'];

class RequestHandler {
    constructor(client) {
        this._client = client;
        this.ratelimits = {};
    }

    request(method, endpoint, data = {}, query = {}, _attempts = 0) {
        const route = this.getRoute(method, endpoint);
        if (!this.ratelimits[route]) {
            this.ratelimits[route] = new Bucket();
        }

        return new Promise((resolve, reject) => {
            const fn = (callback) => {
                const options = {
                    validateStatus: null,
                    headers: {
                        'Authorization': this._client.token,
                        'Content-Type': 'application/json'
                    },
                    baseURL: this._client.baseURL,
                    url: `/${this._client.version ? `${this._client.version}/` : ''}${endpoint}`,
                    method: method,
                    data: data,
                    params: query
                };

                axios.request(options)
                    .then(res => {
                        //  Increase the number of attempts
                        ++_attempts;

                        //  Add the rate limit header data to the bucket
                        this.parseRateLimitHeaders(route, res.headers);

                        //  Reject with an APIError or HTTPError
                        const rejectWithError = () => {
                            if (res.data && res.data.error) {
                                reject(new APIError(res));
                            } else {
                                reject(new HTTPError(res));
                            }
                        };

                        const retryRequest = () => {
                            //  Use the retry-after header to schedule the request to retry
                            if (res.headers['retry-after']) {
                                setTimeout(() => {
                                    this.request(method, endpoint, data, query, _attempts)
                                        .then(resolve)
                                        .catch(reject);
                                }, +res.headers['retry-after']);
                            } else {
                                //  Retry immediately if no retry-after header
                                this.request(method, endpoint, data, query, _attempts)
                                    .then(resolve)
                                    .catch(reject);
                            }
                        };

                        if (res.status >= 200 && res.status < 300) {
                            resolve(res.data);
                        } else if (res.status === 429) {
                            //  Check if too many retry attempts
                            if (_attempts >= this._client.maxRetries) {
                                rejectWithError();
                            } else {
                                retryRequest();
                            }
                        } else {
                            rejectWithError();
                        }

                        callback();
                    });
            };

            this.ratelimits[route].queue(fn);
        });
    }

    getRoute(method, endpoint) {
        const route = endpoint.replace(/\/([a-z-]+)\/(?:(\d+))/g, (match, p) => {
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
