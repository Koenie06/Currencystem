const CurrencyManager = require('../CurrencyManager.js');
const MySQL = require('mysql2');

export default class MySQL extends CurrencyManager {
    constructor({ host, user, password, database, port }) {
        super(options);

        /**
         * The host of the MySQL server.
         * @type {String}
         */
        this.host = host;

        /**
         * The user of the MySQL server.
         * @type {String}
         */
        this.user = user;

        /**
         * The password of the MySQL server.
         * @type {String}
         */
        this.password = password;

        /**
         * The database of the MySQL server.
         * @type {String}
         */
        this.database = database;

        /**
         * The connection to the MySQL server.
         * @type {Number}
         */
        this.port = port;

        this.connection = MySQL.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            port: this.port
        });

    };

    getMoney({}) {
        
    }

    
}