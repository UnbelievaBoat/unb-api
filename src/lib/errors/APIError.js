const HTTPError = require('./HTTPError');

class APIError extends HTTPError {
    constructor(request, response) {
        super(request, response);
        this.message = response.data.message || response.data.error || response.statusText || 'Unknown error';
        this.errors = response.data.errors || null;
    }
}

module.exports = APIError;
