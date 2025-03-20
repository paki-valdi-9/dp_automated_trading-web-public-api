const mongoose = require('mongoose')

const dataSchema =  new mongoose.Schema({
    date: String,
    time: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
})

const tb3DataAsc = mongoose.model('btcusd_tb3_asc_data', dataSchema);

module.exports = tb3DataAsc;