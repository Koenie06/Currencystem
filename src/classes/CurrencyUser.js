export default class CurrencyUser {
    constructor(user) {

        if(!user?.user) return null;
        if(!user?.wallet) user.wallet = 0;
        if(!user?.bank) user.bank = 0;
        if(!user?.items) user.items = [];
        if(!user?.lastWork) user.lastWork = null;
        if(!user?.lastBeg) user.lastBeg = null;
        if(!user?.lastHourly) user.lastHourly = null;
        if(!user?.lastDaily) user.lastDaily = null;
        if(!user?.lastWeekly) user.lastWeekly = null;
        if(!user?.lastMonthly) user.lastMonthly = null;
        if(!user?.lastYearly) user.lastYearly = null;

        /**
         * The user of the CurrencyUser.
         * @type {String}
         */
        this.user = user.user;

        /**
         * The money in the wallet of the CurrencyUser.
         * @type {Number}
         */
        this.wallet = user.wallet;

        /**
         * The money in the bank of the CurrencyUser.
         * @type {Number}
         */
        this.bank = user.bank;

        /**
         * The items in the inventory of the CurrencyUser.
         * @type {CurrencyItem[]}
         */
        this.items = user.items;

        /**
         * Date of when the CurrencyUser last worked.
         * @type {Date}
         */
        this.lastWork = user.lastWork;

        /**
         * Date of when the CurrencyUser last begged.
         * @type {Date}
         */
        this.lastBeg = user.lastBeg;

        return this;
    };
};