async function getInitialBalance(dataInput) {
    const data = await dataInput.findOne().select('initial_balance -_id');

    return data;
}

async function getMarketData(dataInput) {
    const data = await dataInput.find().select('date open high low close -_id');

    return data;
}

async function getMarketPeriod(dataInput){
    const firstDate = await dataInput.findOne().sort({_id: 1}).select('date -_id');
    const lastDate = await dataInput.findOne().sort({_id: -1}).select('date -_id');
    if (!firstDate || !lastDate) {
        return undefined;
    }
    const period = {
        from: firstDate.date,
        to: lastDate.date
    };

    return period;
}

module.exports = {
    getInitialBalance,
    getMarketData,
    getMarketPeriod
};