class APIError extends Error {
    constructor(message, status, errors) {
        super();
        this.name = this.constructor.name;
        this.message = message || 'Unknown error';
        this.status = status;
        this.errors = errors || null;
    }
}

module.exports = APIError;
