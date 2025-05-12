const { Schema, model } = require("mongoose");

module.exports = model("currency-items", new Schema({
    name: String,
    description: {
        type: String,
        default: ""
    },
    price: Number,
    createdAt: {
        type: Date,
        default: null
    },
    solds: {
        type: Number,
        default: 0
    },
    use: {
        type: Function,
        default: null
    },
    stock: {
        type: Number,
        default: null
    }
}));