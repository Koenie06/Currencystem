const { Schema, model } = require("mongoose");

module.exports = model('currency-users', new Schema({
    user: String,
    wallet: {
        type: Number,
        default: 0
    },
    bank: {
        type: Number,
        default: 0
    },
    items: {
        type: Array,
        default: []
    },
    lastWork: {
        type: Date,
        default: null
    },
    lastBeg: {
        type: Date,
        default: null
    },
    lastHourly: {
        type: Date,
        default: null
    },
    lastDaily: {
        type: Date,
        default: null
    },
    lastWeekly: {
        type: Date,
        default: null
    },
    lastMonthly: {
        type: Date,
        default: null
    },
    lastYearly: {
        type: Date,
        default: null
    },
}))