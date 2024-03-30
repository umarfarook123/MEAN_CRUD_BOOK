const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const BOOKS = new mongoose.Schema({

    title: { type: String, required: true, index: 1 },
    author: { type: String,required: true, index: 1 },
    description: { type: String, index: 1 },
    pubYear: { type: Number, required: true, },
    ISBN: { type: String, required: true, },

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'BOOKS', BOOKS, dbPrefix + 'BOOKS');