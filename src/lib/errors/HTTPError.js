class HTTPError extends Error {
    constructor(message, status) {
        super();
        this.name = this.constructor.name;
        this.message = message || 'Unknown error';
        this.status = status;
    }
}

module.exports = HTTPError;
