/**
 * UnbelievaBoat Guild
 */
class Guild {
    constructor(data = {}) {
        /**
         * Guild ID
         * @type {string}
         */
        this.id = data.id;

        /**
         * Guild name
         * @type {string}
         */
        this.name = data.name;

        /**
         * Icon hash
         * @type {string}
         */
        this.icon = data.icon;

        /**
         * User ID of the owner
         * @type {string}
         */
        this.ownerID = data.owner_id;

        /**
         * Total number of members
         * @type {number}
         */
        this.memberCount = data.member_count;

        /**
         * Currency symbol
         * @type {number}
         */
        this.currencySymbol = data.symbol;

        /**
         * Raw data response
         * @type {object}
         */
        Object.defineProperty(this, 'rawData', { value: data });
    }

    get iconURL() {
        return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${this.icon.startsWith("a_") ? "gif" : "png"}` : null;
    }

}

module.exports = Guild;
