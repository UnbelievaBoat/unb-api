class HTTPError extends Error {
    constructor(response) {
        super();
        this.name = this.constructor.name;
        this.message = response.statusText || 'Unknown error';
        this.status = response.status;

        Object.defineProperty(this, 'response', {
            enumerable: true,
            value: response
        });
    }
}

module.exports = HTTPError;
