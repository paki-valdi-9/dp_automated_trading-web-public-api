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

const tb2DataDsc = mongoose.model('btcusd_tb2_dsc_data', dataSchema);

module.exports = tb2DataDsc;