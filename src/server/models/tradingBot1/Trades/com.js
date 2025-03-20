const mongoose = require('mongoose')

const tradesSchema =  new mongoose.Schema({
    unix: Number,
    date: String,
    trade: {
        type: String,
        enum: ['BUY', 'SELL'],
    },
    price: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    balance: Number,
    position_size: Number,
})

const tb1TradesCom = mongoose.model('btcusd_buy_tb1_com_trade', tradesSchema);

module.exports = tb1TradesCom;