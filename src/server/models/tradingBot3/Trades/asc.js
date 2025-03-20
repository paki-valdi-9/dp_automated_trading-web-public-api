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

const tb3TradesAsc = mongoose.model('btcusd_emarsi_tb3_asc_trade', tradesSchema);

module.exports = tb3TradesAsc;