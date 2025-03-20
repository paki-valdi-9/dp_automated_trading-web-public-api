const mongoose = require('mongoose')

const tradesSchema =  new mongoose.Schema({
    unix: Number,
    date: String,
    trade: {
        type: String,
        enum: ['LONG', 'SHORT', 'COVER', 'CLOSE'],
    },
    price: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    balance: Number,
    position_size: Number,
})

const tb4TradesCom = mongoose.model('btcusd_emarsiobv_tb4_dsc_trade', tradesSchema);

module.exports = tb4TradesCom;