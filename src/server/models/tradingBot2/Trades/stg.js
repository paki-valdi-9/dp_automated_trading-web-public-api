const mongoose = require('mongoose')

const tradesSchema =  new mongoose.Schema({
    unix: Number,
    date: String,
    trade: {
        type: String,
        enum: ['LONG', 'SHORT', 'COVER', 'CLOSE', 'NO SIGNAL'],
    },
    price: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    balance: Number,
    position_size: Number,
})

const tb2TradesStg = mongoose.model('btcusd_trends_tb2_stg_trade', tradesSchema);

module.exports = tb2TradesStg;