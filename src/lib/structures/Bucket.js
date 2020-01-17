class Bucket extends Array {
    constructor(limit = 1) {
        super();
        this.processing = false;
        this.limit = limit;
        this.remaining = limit;
        this.reset = null;
    }

    queue(request) {
        this.push(request);
        if (!this.processing) {
            this.processing = true;
            this.execute();
        }
    }

    execute() {
        if (!this.length) {
            clearTimeout(this.processing);
            this.processing = false;
            return;
        }

        const now = Date.now();
        if (!this.reset || this.reset < now) {
            this.reset = now;
            this.remaining = this.limit;
        }


        if (this.remaining <= 0) {
            this.processing = setTimeout(() => this.execute(), Math.max(0, (this.reset || 0) - now));
            return;
        }

        --this.remaining;

        this.shift()(() => this.execute());
    }
}

module.exports = Bucket;
