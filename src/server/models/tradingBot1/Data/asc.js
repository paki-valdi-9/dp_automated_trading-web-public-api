const mongoose = require('mongoose')

const dataSchema =  new mongoose.Schema({
    date: String,
    time: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    initial_balance: Number,
    profit: Number,
})

const tb1DataAsc = mongoose.model('btcusd_tb1_asc_data', dataSchema);

module.exports = tb1DataAsc;