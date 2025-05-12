const CurrencyItem = require('./CurrencyItem.js');
const userSchema = require('./model/user.js.js');
const itemSchema = require('./model/item.js.js');

module.exports = class CurrencyUser {
    constructor(user, options) {

        this.options.maxWallet = options.maxWallet;
        this.options.maxBank = options.maxBank;

        if(!user?.user) return null;
        if(!user?.wallet) user.wallet = options.defaultWallet || 0;
        if(!user?.bank) user.bank = options.defaultBank || 0;
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

        /**
         * Date of when the CurrencyUser last claimed his hourly.
         * @type {Date}
         */
        this.lastHourly = user.lastHourly;

        /**
         * Date of when the CurrencyUser last claimed his daily.
         * @type {Date}
         */
        this.lastDaily = user.lastDaily;

        /**
         * Date of when the CurrencyUser last claimed his weekly.
         * @type {Date}
         */
        this.lastWeekly = user.lastWeekly;

        /**
         * Date of when the CurrencyUser last claimed his monthly.
         * @type {Date}
         */
        this.lastMonthly = user.lastMonthly;

        /**
         * Date of when the CurrencyUser last claimed his yearly.
         * @type {Date}
         */
        this.lastYearly = user.lastYearly;

        return this;
    };

    /**
     * Add a amount of money from the users wallet or bank.
     * @param {Object} options The options to add the money with.
     * @param {number} options.amount The amount of money to add.
     * @param {string} options.place The place to add the money to. 
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
     async addMoney({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        if(place === 'wallet') this.wallet += amount;
        if(place === 'bank') this.bank += amount;
        if(this.wallet > this.options.maxWallet) this.wallet = this.options.maxWallet;
        if(this.bank > this.options.maxBank) this.bank = this.options.maxBank;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Remove a amount of money from the users wallet or bank.
     * @param {Object} options The options to remove the money with.
     * @param {number} options.amount The amount of money to remove.
     * @param {string} options.place The place to remove the money from.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async removeMoney({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        if(place === 'wallet' && this.wallet < amount) return { error: true, message: 'User does not have enough money in his wallet.' };
        if(place === 'bank' && this.bank < amount) return { error: true, message: 'User does not have enough money in his bank.' };
        if(place === 'wallet') this.wallet -= amount;
        if(place === 'bank') this.bank -= amount;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Overwrite the users wallet or bank with the given amount.
     * @param {Object} options The options to remove the money with.
     * @param {number} options.amount The amount of money to overwrite.
     * @param {string} options.place The place to overwrite the money from.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async setMoney({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        if(place === 'wallet') this.wallet = amount;
        if(place === 'bank') this.bank = amount;
        if(this.wallet > this.options.maxWallet) this.wallet = this.options.maxWallet;
        if(this.bank > this.options.maxBank) this.bank = this.options.maxBank;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Deposit an amount of money to the users bank.
     * @param {number} amount The amount of money to deposit.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async deposit(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        const removeData = await this.removeMoney({ amount: amount, place: 'wallet' });
        if(removeData.error) return removeData;
        const addData = await this.addMoney({ amount: amount, place: 'bank' });
        if(addData.error) return addData;
        return new CurrencyUser(addData);
    };

    /**
     * Withdraw an amount of money from the users bank.
     * @param {number} amount The amount of money to withdraw.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async withdraw(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        const removeData = await this.removeMoney({ amount: amount, place: 'bank' });
        if(removeData.error) return removeData;
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        return new CurrencyUser(addData);
    };

    /**
     * @typedef {Object} gambleObject
     * @property {CurrencyUser} user The user the money got removed from.
     * @property {boolean} [lost] If the user lost the gamble.
     * @property {boolean} [won] If the user won the gamble.
     */

    /**
     * Double or lose the amount of money by a percentage of 50%.
     * @param {Object} options The options to gamble with.
     * @param {number} options.amount The amount of money to double or lose.
     * @param {string} options.place The place to double or lose the money from.
     * @returns {Promise<gambleObject>} The user and the amount of money he has.
     */
     async gamble({ amount, place }) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const random = Math.floor(Math.random() * 2);
        if(random === 0) {
            const removeData = await this.removeMoney({ amount: amount, place: place });
            if(removeData.error) return removeData;
            return {
                user: new CurrencyUser(removeData),
                lost: true
            };
        } else {
            const addData = await this.addMoney({ amount: amount * 2, place: place });
            if(addData.error) return addData;
            return {
                user: new CurrencyUser(addData),
                won: true
            };
        };
    };

    /**
     * Buy a item from the shop for money.
     * @param {Object} options The options to buy the item with.
     * @param {string} options.item The item to buy.
     * @param {string} options.place The place to remove the money from.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async buyItem({ item, place }) {
        if(typeof item !== 'string' || !item) throw new Error('Item must be a string.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');

        const items = await this.#_getShop();
        const itemObject = items.find(itemFind => itemFind.name === item);
        if(!itemObject) return { error: true, message: 'Item does not exist.' };

        if(this[place] < itemObject.price) return { error: true, message: 'You do not have enough money to buy this item.' };
        const removeData = await this.removeMoney({ amount: itemObject.price, place: place });
        if(removeData.error) return removeData;
        this.items.push(item);

        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Sell a item from the users inventory for money.
     * @param {Object} options The options to sell the item with.
     * @param {string} options.item The item to sell.
     * @param {string} options.place The place to add the money to. 
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async sellItem({ item, place }) {
        if(typeof item !== 'string' || !item) throw new Error('Item must be a string.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');

        const items = await this.#_getShop();
        const itemObject = items.find(itemFind => itemFind.name === item);
        if(!itemObject) return { error: true, message: 'Item does not exist.' };

        if(!this.items.map(itemMap => itemMap.name === item)[0]) return { error: true, message: 'You do not have this item.' };
        const addData = await this.addMoney({ amount: itemObject.price, place: place });
        if(addData.error) return addData;
        this.items.splice(user.items.findIndex(itemIndex => itemIndex.name === item), 1);

        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    async setItems(items) {
        if(!Array.isArray(items)) throw new Error('Items must be an array.');
        if(items.length === 0) throw new Error('Items array must not be empty.');

        let newItems = items;
        if(items.some(item => (item instanceof CurrencyItem))) newItems = items.map(item => item.toJSON());
        newItems.map(itemMap => this.items.push(itemMap));
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Use a item from the users inventory.
     * @param {Object} options The options to use the item with.
     * @param {string} options.item The item to use.
     * @param {string} options.useParams The params to use for the use function set on the item.
     * 
     */
    async useItem({ item, useParams }) {
        if(typeof item !== 'string' || !item) throw new Error('Item must be a string.');
        if(typeof useParams !== 'string' || !useParams) throw new Error('UseParams must be a string.');

        if(!this.items.map(itemMap => itemMap.name === item)[0]) return { error: true, message: 'You do not have this item.' };
        const itemObject = this.items.map(itemMap => itemMap.name === item)[0];
        if(!itemObject.use) return { error: true, message: 'This item cannot be used.' };

        await eval(`itemObject.use(${user}, ${useParams})`)

        this.items.splice(user.items.findIndex(itemIndex => itemIndex.name === item), 1);
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Rob the money of the other user, if succeeded the robber will get the money. If failed the robber will lose the money.
     * @param {Object} options The options to rob the money with.
     * @param {string} options.victim The user who is getting robbed.
     * @param {number} options.minimum The minimum amount of money the robber can rob.
     * @param {number} options.maximum The maximum amount of money the robber can rob.
     * @param {number} options.succes The chance of the robber to succeed.
     * @returns {Promise<robObject>} If succeeded and the amount of money robbed. If failed and the amount of money lost.
     */
     async rob({ victim, minimum, maximum, succes }) {
        if(typeof victim !== 'string' || !victim) throw new Error('Victim must be a string.');
        if(typeof minimum !== 'number') throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number') throw new Error('Maximum must be a number.');
        if(typeof succes !== 'number') throw new Error('Succes must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(succes <= 0) return { error: true, message: 'Succes must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(succes > 100) return { error: true, message: 'Succes must be lower than 100.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        
        const victimObject = await this.#_getUser(victim);
        if(victimObject.error) return victimObject;

        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const luck = Math.floor(Math.random() * 100);

        if(luck <= succes) {
            if(place === 'wallet' && victimObject.wallet < (victimObject.wallet < random ? victimObject.wallet : random)) return { error: true, message: 'Victim does not have enough money in his wallet.' };
            if(place === 'wallet') victimObject.wallet -= (victimObject.wallet < random ? victimObject.wallet : random);
            const removeUser = await this.#_saveUser({ user: victimObject });
            if(removeUser.error) return removeUser;
            const addUser = await this.addMoney({ amount: random, place: 'wallet' });
            if(addUser.error) return addUser;

            return {
                won: true,
                amount: random,
            };
        } else {
            const removeUser = await this.removeMoney({ amount: this.wallet < random ? this.wallet : random, place: 'wallet' });
            if(removeUser.error) return removeUser;
            victimObject.wallet += amount;
            if(victimObject.wallet > this.options.maxWallet) victimObject.wallet = this.options.maxWallet;
            const addUser = await this.#_saveUser({ user: victimObject });
            if(addUser.error) return addUser;
            return {
                lost: true,
                amount: random,
            };
        };
    };

    /**
     * @typedef {Object} workObject
     * @property {CurrencyUser} user The user who worked for the money.
     * @property {number} earned The amount of money the user earned.
     */

    /**
     * Let the user work for money.
     * @param {Object} options The options to gamble with.
     * @param {string} options.place The place where to store the money.
     * @param {number} options.minimum The minimum amount of money the user can work for.
     * @param {number} options.maximum The maximum amount of money the user can work for.
     * @param {number} options.cooldown The cooldown in milliseconds the user has to wait before working again. 
     * @returns {Promise<workObject>} The amount of money the user worked for and the user data.
     */
    async work({ place, minimum, maximum, cooldown }) {
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        if(typeof minimum !== 'number') throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number') throw new Error('Maximum must be a number.');
        if(typeof cooldown !== 'number') throw new Error('Cooldown must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(cooldown < 0) return { error: true, message: 'Cooldown must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        

        const time = new Date().getTime();
        if(this.lastWork && cooldown - (Date.now() - this.lastWork) > 0) return { error: true, message: 'You can only work every ' + (cooldown / 1000) + ' seconds.' };
        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const addData = await this.addMoney({ amount: random, place: place });
        if(addData.error) return addData;
        this.lastWork = time;
        const newUser = await this.#_saveUser();
        return {
            earned: random,
            user: newUser,
        };
    };

    /**
     * @typedef {Object} begObject
     * @property {CurrencyUser} user The user who begged for the money.
     * @property {number} earned The amount of money the user earned.
     */
    
    /**
     * Let the user beg for money.
     * @param {Object} options The options to gamble with.
     * @param {number} options.minimum The minimum amount of money the user can beg for.
     * @param {number} options.maximum The maximum amount of money the user can beg for.
     * @param {number} options.cooldown The cooldown in milliseconds the user has to wait before begging again.
     * @returns {Promise<begObject>} The amount of money the user begged for and the user data.
     */
    async beg({ minimum, maximum, cooldown }) {
        if(typeof minimum !== 'number') throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number') throw new Error('Maximum must be a number.');
        if(typeof cooldown !== 'number') throw new Error('Cooldown must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(cooldown < 0) return { error: true, message: 'Cooldown must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        
        const time = new Date().getTime();
        if(this.lastBeg && cooldown - (Date.now() - this.lastBeg) > 0) return { error: true, message: 'You can only beg every ' + (cooldown / 1000) + ' seconds.' };
        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const addData = await this.addMoney({ amount: random, place: 'wallet' });
        if(addData.error) return addData;
        this.lastBeg = time;
        const newUser = await this.#_saveUser();
        return {
            earned: random,
            user: newUser,
        }
    };

    /**
     * @typedef {Object} transferObject
     * @property {CurrencyUser} removeFrom The user the money got removed from.
     * @property {CurrencyUser} addTo The user the money got added to.
     */

    /**
     * Transfer an amount of money from one user to another.
     * @param {Object} options The options to transfer the money with.
     * @param {string} options.addTo The user to add the money to.
     * @param {number} options.amount The amount of money to transfer.
     * @param {string} options.place The place to transfer the money from.
     * @returns {Promise<transferObject>} The users and the amount of money they have.
     */
    async transferMoney({ addTo, amount, place }) {
        if(typeof addTo !== 'string' || !addTo) throw new Error('AddTo must be a string.');
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !place || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const removeData = await this.removeMoney({ amount: amount, place: place });
        if(removeData.error) return removeData;
        const addToUser = await this.#_getUser({ user: addTo });
        addToUser[place] += amount;
        if(addToUser[place] > this.options[`max${place.charAt(0).toUpperCase() + place.slice(1)}`]) addToUser[place] = this.options[`max${place.charAt(0).toUpperCase() + place.slice(1)}`];
        const addData = await this.#_saveUser({ user: addToUser });
        if(addData.error) return addData;
        return {
            removeFrom: new CurrencyUser(removeData),
            addTo: new CurrencyUser(addData)
        };
    };

    /**
     * Claim a reward which can be claimed every hour.
     * @param {number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async hourly(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const time = new Date().getTime();
        if(this.lastHourly && 3600000 - (Date.now() - this.lastHourly) > 0) return { error: true, message: 'You can only hourly every 1 hour.' };
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        this.lastHourly = time;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every day.e reward. 
     * @param {number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async daily(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };

        const time = new Date().getTime();
        if(this.lastDaily && 86400000 - (Date.now() - this.lastDaily) > 0) return { error: true, message: 'You can only daily every 24 hours.' };
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        this.lastDaily = time;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every week.
     * @param {number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async weekly(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };

        const time = new Date().getTime();
        if(this.lastWeekly && 604800000 - (Date.now() - this.lastWeekly) > 0) return { error: true, message: 'You can only weekly every 7 days.' };
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        this.lastWeekly = time;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every month.
     * @param {number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async monthly(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };

        const time = new Date().getTime();
        if(this.lastMonthly && 2592000000 - (Date.now() - this.lastMonthly) > 0) return { error: true, message: 'You can only monthly every 30 days.' };
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        this.lastMonthly = time;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every year.
     * @param {number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<CurrencyUser>} The user and the amount of money he has.
     */
    async yearly(amount) {
        if(typeof amount !== 'number') throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };

        const time = new Date().getTime();
        if(this.lastYearly && 31536000000 - (Date.now() - this.lastYearly) > 0) return { error: true, message: 'You can only yearly every 365 days.' };
        const addData = await this.addMoney({ amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        this.lastYearly = time;
        const newUser = await this.#_saveUser();
        return new CurrencyUser(newUser);
    };

    async #_getUser({ user }) {
        let data = await userSchema.findOne({ user: user });

        return data ? data : { user: user, wallet: 0, bank: 0, items: [], lastWork: null, lastBeg: null, lastHourly: null, lastDaily: null, lastWeekly: null, lastMonthly: null, lastYearly: null };	
    };

    async #_saveUser({ user }) {
        if(!user) user = this;
        let data = await userSchema.findOne({ user: user.user });
        if (!data) data = new userSchema({ user: user.user });

        data.wallet = user.wallet;
        data.bank = user.bank;
        data.items = user.items;
        data.lastWork = user.lastWork;
        data.lastBeg = user.lastBeg;
        data.lastHourly = user.lastHourly;
        data.lastDaily = user.lastDaily;
        data.lastWeekly = user.lastWeekly;
        data.lastMonthly = user.lastMonthly;
        data.lastYearly = user.lastYearly;
        await data.save();
    };

    async #_getShop() {
        const data = await itemSchema.find({});
        return data;
    };
};