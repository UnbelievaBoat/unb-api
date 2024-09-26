class HTTPError extends Error {
    constructor(request, response) {
        super();
        this.name = this.constructor.name;
        this.message = response.statusText || 'Unknown error';
        this.status = response.status;

        Object.defineProperty(this, 'request', {
            enumerable: true,
            value: request
        }); 
        
        Object.defineProperty(this, 'response', {
            enumerable: true,
            value: response
        });
    }
}

module.exports = HTTPError;
