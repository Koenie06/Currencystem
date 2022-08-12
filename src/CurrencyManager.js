const { access, readFile, writeFile } = require('node:fs/promises');
const CurrencyUser = require('./classes/CurrencyUser.js');

export default class CurrencyManager extends EventEmitter {

    constructor(options) {
        super();

        this.options = options;
        this.options.storage.users = options.storage.users || './currencyUsers.json';
        this.options.storage.items = options.storage.items || './currencyItems.json';

        access(this.options.storage.users)
        .then(() => true)
        .catch(async () => {
            await writeFile(this.options.storage.users, '[]', 'utf-8');
        })

        access(this.options.storage.items)
        .then(() => true)
        .catch(async () => {
            await writeFile(this.options.storage.items, '[]', 'utf-8');
        })
    };

    /**
     * Get the provided users data.
     * @param {String} user The user to get the data of.
     * @returns {Promise<Object>} CurrencyUser class with user data.
     */
    async getUser({ user }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');

        const userStorage = await this._getUser({ user });
        return new CurrencyUser(userStorage);
    };

    /**
     * Add a amount of money from the users wallet or bank.
     * @param {String} user The user to add the money to.
     * @param {Number} amount The amount of money to add.
     * @param {String} place The place to add the money to. 
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async addMoney({ user, amount, place }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const userStorage = await this._getUser({ user });
        if(place === 'wallet') userStorage.wallet += amount;
        if(place === 'bank') userStorage.bank += amount;
        const newUser = await this._saveUser({ user: userStorage });
        return new CurrencyUser(newUser);
    };

    /**
     * Remove a amount of money from the users wallet or bank.
     * @param {String} user The user to remove the money from.
     * @param {Number} amount The amount of money to remove.
     * @param {String} place The place to remove the money from.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async removeMoney({ user, amount, place }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const userStorage = await this._getUser({ user });
        if(place === 'wallet' && userStorage.wallet < amount) return { error: true, message: 'User does not have enough money in his wallet.' };
        if(place === 'bank' && userStorage.bank < amount) return { error: true, message: 'User does not have enough money in his bank.' };
        if(place === 'wallet') userStorage.wallet -= amount;
        if(place === 'bank') userStorage.bank -= amount;
        const newUser = await this._saveUser({ user: userStorage });
        return new CurrencyUser(newUser);
    };

    /**
     * Give all the users in the DB a amount of money to there wallet or bank.
     * @param {Number} amount The amount of money to add.
     * @param {String} place The place to store the money in.
     * @returns {Promise<Object[]>} All the users and the amount of money they have.
     */
    async addMoneyAll({ amount, place }) {
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const storageContent = await readFile(this.options.storage, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        const storage = JSON.parse(storageContent);
        const users = storage.map(userArray => userArray.user);
        const usersWithMoney = await Promise.all(users.map(user => this.addMoney({ user: user, amount: amount, place: place })));
        const currencyUsers = usersWithMoney.map(user => new CurrencyUser(user));
        return currencyUsers;
    };

    /**
     * Remove from all the users in the DB a amount of money from there wallet or bank.
     * @param {Number} amount The amount of money to remove.
     * @param {String} place The place to remove the money from.
     * @returns {Promise<Object>} All the users and the amount of money they have.
     */
    async removeMoneyAll({ amount, place }) {
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const storageContent = await readFile(this.options.storage, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        const storage = JSON.parse(storageContent);
        const users = storage.map(userArray => userArray.user);
        const usersWithMoney = await Promise.all(users.map(user => this.removeMoney({ user: user, amount: amount, place: place })));
        const currencyUsers = usersWithMoney.map(user => new CurrencyUser(user));
        return currencyUsers;
    };

    /**
     * Deposit an amount of money to the users bank.
     * @param {String} user The user to deposit the money to.
     * @param {Number} amount The amount of money to deposit.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async deposit({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        const removeData = await this.removeMoney({ user: user, amount: amount, place: 'wallet' });
        if(removeData.error) return removeData;
        const addData = await this.addMoney({ user: user, amount: amount, place: 'bank' });
        if(addData.error) return addData;
        return new CurrencyUser(addData);
    };

    /**
     * Withdraw an amount of money from the users bank.
     * @param {String} user The user to withdraw the money from.
     * @param {Number} amount The amount of money to withdraw.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async withdraw({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');

        const removeData = await this.removeMoney({ user: user, amount: amount, place: 'bank' });
        if(removeData.error) return removeData;
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        return new CurrencyUser(addData);
    };

    /**
     * Transfer an amount of money from one user to another.
     * @param {String} removeFrom The user to remove the money from.
     * @param {String} addTo The user to add the money to.
     * @param {Number} amount The amount of money to transfer.
     * @param {String} place The place to transfer the money from.
     * @returns {Promise<Object>} The users and the amount of money they have.
     */
    async transferMoney({ removeFrom, addTo, amount, place }) {
        if(typeof removeFrom !== 'string' || !(removeFrom instanceof String)) throw new Error('RemoveFrom must be a string.');
        if(typeof addTo !== 'string' || !(addTo instanceof String)) throw new Error('AddTo must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const removeData = await this.removeMoney({ user: removeFrom, amount: amount, place: place });
        if(removeData.error) return removeData;
        const addData = await this.addMoney({ user: addTo, amount: amount, place: place });
        if(addData.error) return addData;
        return {
            removeFrom: new CurrencyUser(removeData),
            addTo: new CurrencyUser(addData)
        };
    };

    /**
     * Double or lose the amount of money by a percentage of 50%.
     * @param {String} user The user to double or lose the money from.
     * @param {Number} amount The amount of money to double or lose.
     * @param {String} place The place to double or lose the money from.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async gamble({ user, amount, place }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount <= 0) throw new Error('Amount must be positive or higher than 0.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        
        const random = Math.floor(Math.random() * 2);
        if(random === 0) {
            const removeData = await this.removeMoney({ user: user, amount: amount, place: place });
            if(removeData.error) return removeData;
            return {
                user: new CurrencyUser(removeData),
                lost: true
            };
        } else {
            const addData = await this.addMoney({ user: user, amount: amount * 2, place: place });
            if(addData.error) return addData;
            return {
                user: new CurrencyUser(addData),
                won: true
            };
        };
    };

    /**
     * Get all the shop items.
     * @returns {Promise<Object[]>} A list of all the CurrencyItems in the shop
     */
    async getShop() {
        const items = await this._getShop();
        return items.map(item => new CurrencyItem(item));
    };

    /**
     * Buy a item from the shop for money.
     * @param {String} user The user which buys the item.
     * @param {String} item The item to buy.
     * @param {String} place The place to remove the money from.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async buyItem({ user, item, place }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof item !== 'string' || !(item instanceof String)) throw new Error('Item must be a string.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');

        const items = await this._getShop();
        const itemObject = items.find(itemFind => itemFind.name === item);
        if(!itemObject) return { error: true, message: 'Item does not exist.' };

        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        if(userObject.money < itemObject.price) return { error: true, message: 'You do not have enough money to buy this item.' };
        const removeData = await this.removeMoney({ user: user, amount: itemObject.price, place: place });
        if(removeData.error) return removeData;
        userObject.items.push(item);

        const newUser = await this._saveUser({ user: userObject });
        return new CurrencyUser(newUser);
    };

    /**
     * Sell a item from the users inventory for money.
     * @param {String} user The user which sells the item.
     * @param {String} item The item to sell.
     * @param {String} place The place to add the money to. 
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async sellItem({ user, item, place }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof item !== 'string' || !(item instanceof String)) throw new Error('Item must be a string.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');

        const items = await this._getShop();
        const itemObject = items.find(itemFind => itemFind.name === item);
        if(!itemObject) return { error: true, message: 'Item does not exist.' };

        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        if(!userObject.items.map(itemMap => itemMap.name === item)[0]) return { error: true, message: 'You do not have this item.' };
        const addData = await this.addMoney({ user: user, amount: itemObject.price, place: place });
        if(addData.error) return addData;
        userObject.items.splice(user.items.findIndex(itemIndex => itemIndex.name === item), 1);

        const newUser = await this._saveUser({ user: userObject });
        return new CurrencyUser(newUser);
    };

    /**
     * Add a item to the shop list.
     * @param {String} name The name of the item.
     * @param {String} description The description of the item.
     * @param {Number} price The price of the item.
     * @returns {Promise<Object[]>} The shop list.
     */
    async addItem({ name, description, price }) {
        if(typeof name !== 'string' || !(name instanceof String)) throw new Error('Name must be a string.');
        if(typeof description !== 'string' || !(description instanceof String)) throw new Error('Description must be a string.');
        if(typeof price !== 'number' || !(price instanceof Number)) throw new Error('Price must be a number.');

        if(price <= 0) return { error: true, message: 'Price must be positive or higher than 0.' };
        const items = await this._getShop();
        if(items.map(item => item.name).includes(name)) return { error: true, message: 'Item already exists.' };
        items.push(new CurrencyItem({ name: name, description: description, price: price }));
        const newShop = await this._saveShop(items);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Remove a item from the shop list.
     * @param {String} name The name of the item. 
     * @returns {Promise<Object[]>} The shop list.
     */
    async removeItem({ name }) {
        if(typeof name !== 'string' || !(name instanceof String)) throw new Error('Name must be a string.');

        const items = await this._getShop();
        if(!items.map(item => item.name).includes(name)) return { error: true, message: 'Item does not exist.' };
        items.splice(items.findIndex(item => item.name === name), 1);
        const newShop = await this._saveShop(items);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Override the current shop list and set a new one.
     * @param {CurrencyItem[] | Object[]} items The items to save.
     * @returns {Promise<Object[]>} The shop list.
     */
    async setItems({ items }) {
        if(!Array.isArray(items)) throw new Error('Items must be an array.');
        if(items.length === 0) throw new Error('Items array must not be empty.');

        let newItems = items;
        if(items.some(item => (item instanceof CurrencyItem))) newItems = items.map(item => item.toJSON());
        const newShop = await this._saveShop(newItems);
        return newShop.map(item => new CurrencyItem(item));
    };

    /**
     * Rob the money of the other user, if succeeded the robber will get the money. If failed the robber will lose the money.
     * @param {String} robber The user who is robbing.
     * @param {String} victim The user who is getting robbed.
     * @param {Number} minimum The minimum amount of money the robber can rob.
     * @param {Number} maximum The maximum amount of money the robber can rob.
     * @param {Number} succes The chance of the robber to succeed.
     * @returns {Promise<Object>} If succeeded and the amount of money robbed. If failed and the amount of money lost.
     */
    async rob({ robber, victim, minimum, maximum, succes }) {
        if(typeof robber !== 'string' || !(robber instanceof String)) throw new Error('Robber must be a string.');
        if(typeof victim !== 'string' || !(victim instanceof String)) throw new Error('Victim must be a string.');
        if(typeof minimum !== 'number' || !(minimum instanceof Number)) throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number' || !(maximum instanceof Number)) throw new Error('Maximum must be a number.');
        if(typeof succes !== 'number' || !(succes instanceof Number)) throw new Error('Succes must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(succes <= 0) return { error: true, message: 'Succes must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(succes > 100) return { error: true, message: 'Succes must be lower than 100.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        
        const robberObject = await this._getUser(robber);
        if(robberObject.error) return robberObject;
        const victimObject = await this._getUser(victim);
        if(victimObject.error) return victimObject;

        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const luck = Math.floor(Math.random() * 100);

        if(luck <= succes) {
            const removeUser = await this.removeMoney({ user: victim, amount: victimObject.wallet < random ? victimObject.wallet : random, place: 'wallet' });
            if(removeUser.error) return removeUser;
            const addUser = await this.addMoney({ user: robber, amount: random, place: 'wallet' });
            if(addUser.error) return addUser;

            return {
                won: true,
                amount: random,
            };
        } else {
            const removeUser = await this.removeMoney({ user: robber, amount: robberObject.wallet < random ? robberObject.wallet : random, place: 'wallet' });
            if(removeUser.error) return removeUser;
            const addUser = await this.addMoney({ user: victim, amount: random, place: 'wallet' });
            if(addUser.error) return addUser;
            return {
                lost: true,
                amount: random,
            };
        };
    };

    /**
     * Let the user work for money.
     * @param {String} user The user who is working.
     * @param {String} place The place where to store the money.
     * @param {Number} minimum The minimum amount of money the user can work for.
     * @param {Number} maximum The maximum amount of money the user can work for.
     * @param {Number} cooldown The cooldown in milliseconds the user has to wait before working again. 
     * @returns {Promise<Object>} The amount of money the user worked for and the user data.
     */
    async work({ user, place, minimum, maximum, cooldown }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof place !== 'string' || !(place instanceof String) || !(['wallet', 'bank'].includes(place))) throw new Error('Place must be a string called \'wallet\' or \'bank\'.');
        if(typeof minimum !== 'number' || !(minimum instanceof Number)) throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number' || !(maximum instanceof Number)) throw new Error('Maximum must be a number.');
        if(typeof cooldown !== 'number' || !(cooldown instanceof Number)) throw new Error('Cooldown must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(cooldown < 0) return { error: true, message: 'Cooldown must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastWork && cooldown - (Date.now() - userObject.lastWork) > 0) return { error: true, message: 'You can only work every ' + (cooldown / 1000) + ' seconds.' };
        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const addData = await this.addMoney({ user: user, amount: random, place: place });
        if(addData.error) return addData;
        userObject.lastWork = time;
        const newUser = await this._saveUser(userObject);
        return {
            earned: random,
            user: newUser,
        };
    };

    /**
     * Let the user beg for money.
     * @param {String} user The user who is begging.
     * @param {Number} minimum The minimum amount of money the user can beg for.
     * @param {Number} maximum The maximum amount of money the user can beg for.
     * @param {Number} cooldown The cooldown in milliseconds the user has to wait before begging again.
     * @returns {Promise<Object>} The amount of money the user begged for and the user data.
     */
    async beg({ user, minimum, maximum, cooldown }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof minimum !== 'number' || !(minimum instanceof Number)) throw new Error('Minimum must be a number.');
        if(typeof maximum !== 'number' || !(maximum instanceof Number)) throw new Error('Maximum must be a number.');
        if(typeof cooldown !== 'number' || !(cooldown instanceof Number)) throw new Error('Cooldown must be a number.');
        if(minimum < 0) return { error: true, message: 'Minimum must be positive or higher than 0.' };
        if(maximum <= 0) return { error: true, message: 'Maximum must be positive or higher than 0.' };
        if(cooldown < 0) return { error: true, message: 'Cooldown must be positive or higher than 0.' };
        if(minimum > maximum) return { error: true, message: 'Minimum must be lower than maximum.' };
        if(minimum === maximum) return { error: true, message: 'Minimum and maximum must not be equal.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastBeg && cooldown - (Date.now() - userObject.lastBeg) > 0) return { error: true, message: 'You can only beg every ' + (cooldown / 1000) + ' seconds.' };
        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        const addData = await this.addMoney({ user: user, amount: random, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastBeg = time;
        const newUser = await this._saveUser(userObject);
        return {
            earned: random,
            user: newUser,
        }
    };

    /**
     * Claim a reward which can be claimed every hour.
     * @param {String} user The user who is claiming the reward.
     * @param {Number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async hourly({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastHourly && 3600000 - (Date.now() - userObject.lastHourly) > 0) return { error: true, message: 'You can only hourly every 1 hour.' };
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastHourly = time;
        const newUser = await this._saveUser(userObject);
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every day.
     * @param {String} user The user who is claiming the reward. 
     * @param {Number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async daily({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastDaily && 86400000 - (Date.now() - userObject.lastDaily) > 0) return { error: true, message: 'You can only daily every 24 hours.' };
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastDaily = time;
        const newUser = await this._saveUser(userObject);
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every week.
     * @param {String} user The user who is claiming the reward. 
     * @param {Number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async weekly({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastWeekly && 604800000 - (Date.now() - userObject.lastWeekly) > 0) return { error: true, message: 'You can only weekly every 7 days.' };
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastWeekly = time;
        const newUser = await this._saveUser(userObject);
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every month.
     * @param {String} user The user who is claiming the reward. 
     * @param {Number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async monthly({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastMonthly && 2592000000 - (Date.now() - userObject.lastMonthly) > 0) return { error: true, message: 'You can only monthly every 30 days.' };
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastMonthly = time;
        const newUser = await this._saveUser(userObject);
        return new CurrencyUser(newUser);
    };

    /**
     * Claim a reward which can be claimed every year.
     * @param {String} user The user who is claiming the reward. 
     * @param {Number} amount The amount of money the user can claim for the reward.
     * @returns {Promise<Object>} The user and the amount of money he has.
     */
    async yearly({ user, amount }) {
        if(typeof user !== 'string' || !(user instanceof String)) throw new Error('User must be a string.');
        if(typeof amount !== 'number' || !(amount instanceof Number)) throw new Error('Amount must be a number.');
        if(amount < 0) return { error: true, message: 'Amount must be positive or higher than 0.' };
        
        const userObject = await this._getUser(user);
        if(userObject.error) return userObject;
        const time = new Date().getTime();
        if(userObject.lastYearly && 31536000000 - (Date.now() - userObject.lastYearly) > 0) return { error: true, message: 'You can only yearly every 365 days.' };
        const addData = await this.addMoney({ user: user, amount: amount, place: 'wallet' });
        if(addData.error) return addData;
        userObject.lastYearly = time;
        const newUser = await this._saveUser(userObject);
        return new CurrencyUser(newUser);
    };

    async _getUser({ user }) {
        const storageContent = await readFile(this.options.storage.users, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        const storage = JSON.parse(storageContent);
        const userStorage = storage.filter(userArray => userArray.user === user);

        return userStorage[0] ? userStorage[0] : { user: user, wallet: 0, bank: 0, items: [], lastWork: null, lastBeg: null };
    };

    async _saveUser({ user }) {
        const storageContent = await readFile(this.options.storage.users, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        const storage = JSON.parse(storageContent);
        const userIndex = storage.findIndex(userArray => userArray.user === user.user);
        userIndex ? storage[userIndex] = user : storage.push(user);
        await writeFile(this.options.storage.users, JSON.stringify(storage), { encoding: 'utf-8' });
        return user;
    };

    async _getShop() {
        const storageContent = await readFile(this.options.storage.items, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        const storage = JSON.parse(storageContent);
        return storage;
    };

    async _saveShop(items) {
        const storageContent = await readFile(this.options.storage.items, { encoding: 'utf-8' });
        if (!storageContent.trim().startsWith('[') || !storageContent.trim().endsWith(']')) {
            console.log(storageContent);
            throw new SyntaxError('The storage file is not properly formatted (does not contain an array).');
        };

        await writeFile(this.options.storage.users, JSON.stringify(items), { encoding: 'utf-8' });
        return items;
    }
};