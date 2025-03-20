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

const tb4DataCom = mongoose.model('btcusd_tb4_com_data', dataSchema);

module.exports = tb4DataCom;