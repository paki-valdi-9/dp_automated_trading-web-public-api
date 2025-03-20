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

const tb1DataCom = mongoose.model('btcusd_tb1_com_data', dataSchema);

module.exports = tb1DataCom;