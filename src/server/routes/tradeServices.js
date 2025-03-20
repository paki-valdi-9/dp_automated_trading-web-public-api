async function calculateLongestTrade(tradeOpenType, tradeCloseType, tradeInput) {
    let data = await tradeInput.find({ trade: { $in: [tradeOpenType, tradeCloseType] } })
                                 .sort({ date: 1 })
                                 .select('date trade -_id');

    let longestDuration = 0;
    let currentOpenDate = null;
    let longestTrade = null;
    let currentOpenDateNormalFormat = null

    data.forEach((item, index) => {
        if (item.trade === tradeOpenType && !currentOpenDate) {
            currentOpenDate = new Date(item.date);
            currentOpenDateNormalFormat = item.date
        } else if (item.trade === tradeCloseType && currentOpenDate) {
            let closeDate = new Date(item.date);
            let closeDateNormalFormat = item.date
            let duration = (closeDate - currentOpenDate) / (1000 * 60 * 60 * 24);

            if (duration > longestDuration) {
                longestDuration = duration;
                longestTrade = {
                    tradeType: tradeOpenType,
                    start: currentOpenDateNormalFormat,
                    end: closeDateNormalFormat,
                    duration: Math.round(longestDuration)
                };
            }
            currentOpenDate = null;
        }
    });

    return longestTrade;
}

async function getFinalBalanceValues(tradeType, tradeInput){
    let data = await tradeInput.find({trade: {$in: [tradeType]}}).sort({date: 1}).select('date balance -_id');
    data = data.map(trade => {
        return {
            ...trade.toObject(),
            balance: parseFloat(trade.balance).toFixed(2)
        };
    });
    return data;
}

async function getUniqueTrades(tradeInput){
    const tradeCounts = await tradeInput.aggregate([
        {
            $group: {
                _id: '$trade',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                trade: '$_id',
                count: 1 
            }
        },
        {
            $sort: { trade: 1 }
        }
    ]);

    tradeCounts.sort((a, b) => {
        const order = ['LONG', 'BUY', 'SHORT', 'SELL'];
        
        const indexA = order.indexOf(a.trade) !== -1 ? order.indexOf(a.trade) : order.length;
        const indexB = order.indexOf(b.trade) !== -1 ? order.indexOf(b.trade) : order.length;
        
        if (indexA !== indexB) {
            return indexA - indexB;
        } else {
            return b.count - a.count;
        }
    });

    return tradeCounts;
}

async function getTradesEarnings(dataInput, tradeInput){
    const firstTrade = await tradeInput.find().sort({_id: 1}).select('position_size -_id').exec()
    const firstPositionSize = (firstTrade.find(trade => trade.position_size !== 0)).position_size;
    const lastTrade = await tradeInput.findOne().sort({_id: -1}).select('balance -_id');
    const lastDayData = await dataInput.findOne().sort({ date: -1 }).select('close -_id');

    const holdEarn = firstPositionSize * lastDayData.close
    const percentageDiff = (Math.round(lastTrade.balance) - Math.round(holdEarn)) / Math.round(holdEarn) * 100
    const data = {
        holdingEarn: Math.round(holdEarn),
        tradingEarn: Math.round(lastTrade.balance),
        holdTradeDiff: Math.round(lastTrade.balance) - Math.round(holdEarn),
        holdTradePercentageDiff: Math.round(percentageDiff)
    }

    return data;
}

async function getLastBalance(tradeInput){
    const data = await tradeInput.findOne().sort({_id: -1}).select('balance -_id');

    return Number(data.balance.toFixed(2));
}

async function getMaximumGain(openPosition, closePosition, tradeInput){
    const trades = await tradeInput.find({trade: {$in: [openPosition, closePosition]}})
                            .sort({date: 1})
                            .select('trade balance -_id');

    let gains = [];
    let buyPrice = 0;
    trades.forEach(item => {
        if (item.trade === openPosition) {
            buyPrice = item.balance;
        } else if (item.trade === closePosition && buyPrice !== 0) {
            const sellPrice = item.balance;
            const gain = sellPrice - buyPrice;
            const percentageGain = ((sellPrice - buyPrice) / buyPrice) * 100;
            gains.push({ absolute: gain, percentage: percentageGain });
        }
    });

    const maxGainObj = gains.reduce((prev, current) => (prev.absolute > current.absolute) ? prev : current, { absolute: 0, percentage: 0 });
    const maxGain = Math.round(maxGainObj.absolute);
    const maxGainPercentage = Math.round(maxGainObj.percentage * 100) / 100;

    return { maxGain, maxGainPercentage };
}

async function getMaximumLoss(openPosition, closePosition,tradeInput){
    const trades = await tradeInput.find({trade: {$in: [openPosition, closePosition]}})
                              .sort({date: 1})
                              .select('trade balance -_id');

    let losses = [];
    let buyPrice = 0;
    trades.forEach(item => {
        if (item.trade === openPosition) {
            buyPrice = item.balance;
        } else if (item.trade === closePosition && buyPrice !== 0) {
            const sellPrice = item.balance;
            const loss = sellPrice - buyPrice;
            if(loss < 0) {
                const percentageLoss = (loss / buyPrice) * 100;
                losses.push({ absolute: loss, percentage: percentageLoss });
            }
        }
    });

    const maxLossObj = losses.reduce((prev, current) => (prev.absolute < current.absolute) ? prev : current, { absolute: 0, percentage: 0 });
    const maxLoss = Math.round(maxLossObj.absolute);
    const maxLossPercentage = Math.round(maxLossObj.percentage * 100) / 100;

    if (!losses.length) {
        return { maxLoss: 0, maxLossPercentage: 0 };
    }

    return { maxLoss, maxLossPercentage };
}

async function getPercentageProfitFromTrading(dataInput, tradeInput){
    const data = await dataInput.findOne().select('initial_balance -_id')
    const trades = await tradeInput.findOne().sort({_id: -1}).select('balance -_id');
    const profit = Math.round(((trades.balance - data.initial_balance) / data.initial_balance) * 100)

    return profit;
}

async function getMdd(tradeTypes, tradeInput) {
    let data = await tradeInput.find({trade: {$in: tradeTypes}}).sort({date: 1}).select('date balance -_id');
    data = data.map(trade => ({
        ...trade.toObject(),
        balance: parseFloat(trade.balance)
    }));

    let peak = data.length > 0 ? data[0].balance : 0;
    let maxDrawdown = 0;
    let maxMonetaryLoss = 0;
    let date;

    data.forEach(trade => {
        peak = Math.max(peak, trade.balance);
        const drawdown = ((peak - trade.balance) / peak) * 100;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
            maxMonetaryLoss = peak - trade.balance;
            date = trade.date
        }
    }); 

    return { 
      maxDrawdown: maxDrawdown.toFixed(2),
      maxMonetaryLoss: maxMonetaryLoss.toFixed(2)
    };
}

module.exports = {
    calculateLongestTrade,
    getFinalBalanceValues,
    getUniqueTrades,
    getTradesEarnings,
    getLastBalance,
    getMaximumGain,
    getMaximumLoss,
    getPercentageProfitFromTrading,
    getMdd
};
