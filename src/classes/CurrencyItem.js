module.exports = class CurrencyItem {
    constructor(item) {

        if(!item?.name) return null;
        if(!item?.description) item.description = "";
        if(!item?.price) return null;
        if(!item?.createdAt) item.createdAt = Date.now();
        if(!item?.solds) item.solds = 0;
        if(!item?.use) item.use = false;

        /**
         * The name of the CurrencyItem.
         * @type {String}
         */
        this.name = item.name;

        /**
         * The description of the CurrencyItem.
         * @type {String}
         */
        this.description = item.description;

        /**
         * The price of the CurrencyItem.
         * @type {Number}
         */
        this.price = item.price;

        /**
         * The date of creation of the CurrencyItem.
         * @type {Date}
         */
        this.createdAt = item.createdAt;

        /**
         * The amount the CurrencyItem has been sold.
         * @type {Number}
         */
        this.solds = item.solds || 0;

        /**
         * What happens when the item is being used.
         * @type {Function}
         */
        this.use = item.use;

        /**
         * The remaining amount that is left to be sold.
         * @type {Number}
         * @not_required
         */
        if(item.stock) this.stock = item.stock;

        return this;
    };

    toJSON() {
        return this;
    };
};