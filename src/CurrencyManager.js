const CurrencyUser = require('./classes/CurrencyUser.js');
const CurrencyItem = require('./classes/CurrencyItem.js');
const mongoose = require('mongoose');
const userSchema = require('./model/user.js');
const itemSchema = require('./model/item.js');

module.exports.CurrencyManager = class CurrencyManager {

    /**
     * Create a new CurrencyManager.
     * @param {Object} options The options for the CurrencyManager.
     * @param {Object} options.mongoURL The url to the mongodb.
     */
    constructor(options) {
        this.options = options;
        if(typeof options.mongoURL !== 'string' || !options.mongoURL) throw new Error('MongoURL must be a string.');

        try {
            mongoose.connect(options.mongoURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (e) {
            throw new Error('Could not connect to mongoDB.');
        };

        mongoose.connection.on("connected", () => {
            console.log("[Currencystem] - Connected to the mongo database!");
        });
    };

    /**
     * Set the default amount for the wallet when a user is created.
     * @param {number} amount The amount to set as default wallet.
     * @returns {boolean} true.
     */
    setDefaultWallet(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        this.options.defaultWallet = amount;
        return true;
    };

    /**
     * Set the default amount for the bank when a user is created.
     * @param {number} amount The amount to set as default bank.
     * @returns {boolean} true.
     */
    setDefaultBank(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        this.options.defaultBank = amount;
        return true;
    };

    /**
     * Set the max amount for the wallet.
     * @param {number} amount The amount to set for max wallet.
     * @returns {boolean} true.
     */
    setMaxWallet(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        this.options.maxWallet = amount;
        return true;
    };

    /**
     * Set the max amount for the bank.
     * @param {number} amount The amount to set for max bank.
     * @returns {boolean} true.
     */
    setMaxBank(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        this.options.maxBank = amount;
        return true;
    };

    /**
     * Get the provided users data.
     * @param {Object} options The options to get the user with.
     * @param {string} options.user The user to get the data of.
     * @returns {Promise<CurrencyUser>} CurrencyUser class with user data.
     */
    async getUser({ user }) {
        if(typeof user !== 'string' || !user) throw new Error('User must be a string.');

        const userStorage = await this.#_getUser({ user });
        return new CurrencyUser(userStorage, this.options);
    };

    /**
     * Give all the users in the DB a amount of money to there wallet or bank.
     * @param {Object} options The options to give all the users money with.
     * @param {number} options.amount The amount of money to add.
     * @param {string} options.place The place to store the money in.
     * @returns {Promise<CurrencyUser[]>} All the users and the amount of money they have.
     */
    async addMoneyAll({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const storage = await this.#_getAllUsers();
        const users = storage.map(userArray => userArray.user);
        const usersWithMoney = await Promise.all(users.map(user => this.addMoney({ user: user, amount: amount, place: place })));
        const currencyUsers = usersWithMoney.map(user => new CurrencyUser(user, this.options));
        return currencyUsers;
    };

    /**
     * Remove from all the users in the DB a amount of money from there wallet or bank.
     * @param {Object} options The options to remove all the users money with.
     * @param {number} options.amount The amount of money to remove.
     * @param {string} options.place The place to remove the money from.
     * @returns {Promise<CurrencyUser[]>} All the users and the amount of money they have.
     */
    async removeMoneyAll({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const storage = await this.#_getAllUsers();
        const users = storage.map(userArray => userArray.user);
        const usersWithMoney = await Promise.all(users.map(user => this.removeMoney({ user: user, amount: amount, place: place })));
        const currencyUsers = usersWithMoney.map(user => new CurrencyUser(user, this.options));
        return currencyUsers;
    };

    /**
     * Get all the shop items.
     * @returns {Promise<CurrencyItem[]>} A list of all the CurrencyItems in the shop
     */
    async getShop({ filter }) {
        const items = await this.#_getShop({ filter: filter });
        return items.map(item => new CurrencyItem(item));
    };

    /**
     * Add a item to the shop list.
     * @param {Object} options The options to add the item with.
     * @param {string} options.name The name of the item.
     * @param {string} options.description The description of the item.
     * @param {number} options.price The price of the item.
     * @param {function} options.use The use function of the item, default params for function: <user>, <customParams>.
     * @returns {Promise<CurrencyItem[]>} The shop list.
     */
    async addItem({ name, description, price, use }) {
        if(typeof name !== 'string' || !name) throw new Error('Name must be a string.');
        if(typeof description !== 'string' || !description) throw new Error('Description must be a string.');
        if(typeof price !== 'number') throw new Error('Price must be a number.');
        if(typeof use !== 'function' || !(use instanceof Function)) throw new Error('Use must be a function.');

        if(price <= 0) return { error: true, message: 'Price must be positive or higher than 0.' };
        const items = await this.#_getShop();
        if(items.map(item => item.name).includes(name)) return { error: true, message: 'Item already exists.' };
        items.push(new CurrencyItem({ name: name, description: description, price: price, use: use }));
        const newShop = await this.#_saveShop(items);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Remove a item from the shop list.
     * @param {Object} options The options to remove the item with.
     * @param {string} options.name The name of the item. 
     * @returns {Promise<CurrencyItem[]>} The shop list.
     */
    async removeItem({ name }) {
        if(typeof name !== 'string' || !name) throw new Error('Name must be a string.');

        const items = await this.#_getShop();
        if(!items.map(item => item.name).includes(name)) return { error: true, message: 'Item does not exist.' };
        items.splice(items.findIndex(item => item.name === name), 1);
        const newShop = await this.#_saveShop(items);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Override the current shop list and set a new one.
     * @param {CurrencyItem[] | Object[]} items The items to save.
     * @returns {Promise<CurrencyItem[]>} The shop list.
     */
    async setItems(items) {
        if(!Array.isArray(items)) throw new Error('Items must be an array.');
        if(items.length === 0) throw new Error('Items array must not be empty.');

        let newItems = items;
        if(items.some(item => (item instanceof CurrencyItem))) newItems = items.map(item => item.toJSON());
        const newShop = await this.#_saveShop(newItems);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Get the leaderboard of the users.
     * @param {Object} options The options to get the leaderboard with.
     * @param {Function} options.filter The filter to use for getting the users. 
     * @returns {Promise<CurrencyUser[]>} The users from the leaderboard.
     */
    async leaderboard({ filter }) {
        if(typeof filter !== 'function' || !(filter instanceof Function)) throw new Error('Filter must be a function.');

        const users = await this.#_getAllUsers({ filter: filter });
        const leaderboard = users.sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank));
        return leaderboard.map(user => new CurrencyUser(user, this.options));
    }

    async #_getUser({ user }) {
        let data = await userSchema.findOne({ user: user });

        return data ? data : { user: user, wallet: 0, bank: 0, items: [], lastWork: null, lastBeg: null, lastHourly: null, lastDaily: null, lastWeekly: null, lastMonthly: null, lastYearly: null };	
    };

    async #_getAllUsers({ filter }) {
        const data = await userSchema.find({});
        if(filter) return data.filter(filter);
        return data;
    };

    async #_getShop({ filter }) {
        const data = await itemSchema.find({});
        if(filter) return data.filter(filter);
        return data;
    };

    async #_saveShop(items) {
        await itemSchema.deleteMany({});
        await itemSchema.insertMany(items);
        return items;
    };
};