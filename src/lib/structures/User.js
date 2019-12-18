/**
 * UnbelievaBoat User Balance
 */
class User {
    constructor(data = {}) {
        /**
         * Leaderboard rank of the user
         * @type {?number}
         */
        this.rank = data.rank;

        /**
         * User ID of the discord user.
         * @type {string}
         */
        this.user_id = data.user_id;

        /**
         * User's cash balance.
         * @type {number}
         */
        this.cash = data.cash;

        /**
         * User's bank balance.
         * @type {number}
         */
        this.bank = data.bank;

        /**
         * User's total balance.
         * @type {number}
         */
        this.total = data.total;


        /**
         * Raw data response
         * @type {object}
         */
        Object.defineProperty(this, 'rawData', { value: data });
    }

    get id() {
        return this.user_id;
    }

}

module.exports = User;
