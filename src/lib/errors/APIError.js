class APIError extends Error {
    constructor(response) {
        super();
        this.name = this.constructor.name;
        this.message = response.data.error || response.data.message || 'Unknown error';
        this.status = response.status;
        this.errors = response.data.errors || null;

        Object.defineProperty(this, 'response', {
            enumerable: true,
            value: response
        });
    }
}

module.exports = APIError;
