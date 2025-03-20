const { calculateLongestTrade, getFinalBalanceValues, getUniqueTrades, getTradesEarnings, getLastBalance, getMaximumGain, getMaximumLoss, getPercentageProfitFromTrading, getMdd } = require('../tradeServices');

const express = require('express')
const router = express.Router()

const tb4TradesAsc = require('../../models/tradingBot4/Trades/asc') 
const tb4TradesDsc = require('../../models/tradingBot4/Trades/dsc') 
const tb4TradesStg = require('../../models/tradingBot4/Trades/stg') 
const tb4TradesCom = require('../../models/tradingBot4/Trades/com') 

console.log(tb4TradesAsc)

const tb1DataAsc = require('../../models/tradingBot1/Data/asc') 
const tb1DataDsc = require('../../models/tradingBot1/Data/dsc') 
const tb1DataStg = require('../../models/tradingBot1/Data/stg') 
const tb1DataCom = require('../../models/tradingBot1/Data/com') 



/*** Trading Bot 4 Trades ***/
// Get all asc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves all BTC-USD trades in ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Array of BTC-USD trades in ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the data point.
 *                     example: "2020-10-01"
 *                   balance:
 *                     type: number
 *                     description: The balance at current closing position.
 *                     example: 106.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades', async (req, res) => {
    try {
        const longData = await getFinalBalanceValues('CLOSE', tb4TradesAsc)
        const shortData = await getFinalBalanceValues('COVER', tb4TradesAsc)
        const data = longData.concat(shortData);
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Trades Tb4 ASC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get mdd asc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb1/btcusd_emarsiobv_tb4_asc_trades/mdd:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves MDD for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object MDD for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxDrawdown:
 *                     type: number
 *                     description: MDD for current period (value is calculated in %).
 *                     example: 6.45
 *                   maxMonetaryLoss:
 *                     type: number
 *                     description: Monetary loss for current period.
 *                     example: 13.67
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/mdd', async (req, res) => {
    try {
        const mdd = await getMdd(['CLOSE', 'COVER'], tb4TradesAsc)
        if (mdd.maxDrawdown && mdd.maxMonetaryLoss) {
            res.status(200).json(mdd);
        }else {
            res.status(404).json({ message: "Cannot Get Mdd Tb4 ASC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get longest trades asc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/longest-trade:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Longest trade for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object Longest trade for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tradeType:
 *                     type: string
 *                     description: The type of trade.
 *                     example: "LONG"
 *                   start:
 *                     type: string
 *                     format: date
 *                     description: The start date of the data point.
 *                     example: "2020-10-01 00:00:00"
 *                   end:
 *                     type: string
 *                     format: date
 *                     description: The end date of the data point.
 *                     example: "2020-10-22 00:00:00"
 *                   duration:
 *                     type: number
 *                     description: Duration of longest trade.
 *                     example: 7
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/longest-trade', async (req, res) => {
    try {
        const longestLong = await calculateLongestTrade('LONG', 'CLOSE', tb4TradesAsc);
        const longestShort = await calculateLongestTrade('SHORT', 'COVER', tb4TradesAsc);
        const longestTrades = []
        if(longestLong){
            longestTrades.push(longestLong)
        }
        if(longestShort){
        longestTrades.push(longestShort)
        }
        if (longestTrades) {
            res.status(200).json(longestTrades);
        } else {
            res.status(404).json({ message: "Cannot Get Longest Trade Tb4 ASC" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get aggregate asc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/unique-trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Unique trades for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of Unique trades for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 *                     description: The count of trade.
 *                     example: 33
 *                   trade:
 *                     type: string
 *                     description: The specifi trade.
 *                     example: "BUY"
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/unique-trades', async (req, res) => {
    try {
        const tradeCounts = await getUniqueTrades(tb4TradesAsc)
        if (tradeCounts) {
            res.status(200).json(tradeCounts);
        } else {
            res.status(404).json({ message: "Cannot Get Unique Trades Tb4 ASC." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get earned asc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/earned:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves earned values for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of earned values for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   holdingEarn:
 *                     type: number
 *                     description: Hold earn from starting point represented at the end point.
 *                     example: 441
 *                   tradingEarn:
 *                     type: number
 *                     description: Trading earn from starting point represented at the end point.
 *                     example: 653
 *                   holdTradeDiff:
 *                     type: number
 *                     description: Difference between traded and earned money.
 *                     example: 132
 *                   holdTradePercentageDiff:
 *                     type: number
 *                     description: Difference between traded and earned money in %.
 *                     example: 27
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/earned', async (req, res) => {
    try {
        const data = await getTradesEarnings(tb1DataAsc, tb4TradesAsc)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 ASC." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
//Get last balance asc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/last-balance:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves last balance for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of last balance for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   balance:
 *                     type: number
 *                     description: The last balance in trading period.
 *                     example: 441
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/last-balance', async (req, res) => {
    try {
        const balance = await getLastBalance(tb4TradesAsc)
        if (balance) {
            res.status(200).json({balance: Number(balance)})
        } else {
            res.status(404).json({ message: "Cannot Get Last Balance Tb4 ASC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
//Get maximum gain asc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/maximum-gain:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum gain for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum gain for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxGain:
 *                     type: number
 *                     description: The trade with the most gain.
 *                     example: 24
 *                   maxGainPercentage:
 *                     type: number
 *                     description: The percentage value of increased balance by this trade.
 *                     example: 12.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/maximum-gain', async (req, res) => {
    try {
        const roundedMaxGainLong = await getMaximumGain('LONG', 'CLOSE', tb4TradesAsc)
        const roundedMaxGainShort = await getMaximumGain('SHORT', 'COVER', tb4TradesAsc)
        let roundedMaxGain;
        if(roundedMaxGainLong >= roundedMaxGainShort){
            roundedMaxGain = roundedMaxGainLong
        } else {
            roundedMaxGain = roundedMaxGainShort
        }
        if (roundedMaxGain) {
            res.status(200).json({maxGain: roundedMaxGain.maxGain, maxGainPercentage: roundedMaxGain.maxGainPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Gain Tb4 ASC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get maximum loss asc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/maximum-loss:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum loss for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum loss for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxLoss:
 *                     type: number
 *                     description: The trade with the biggest loss.
 *                     example: 28
 *                   maxLossPercentage:
 *                     type: number
 *                     description: The percentage value of decreased balance by this trade.
 *                     example: 33.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/maximum-loss', async (req, res) => {
    try {
        const roundedMaxLossLong = await getMaximumLoss('LONG', 'CLOSE', tb4TradesAsc)
        const roundedMaxLossShort = await getMaximumLoss('SHORT', 'COVER', tb4TradesAsc)
        let roundedMaxLoss;
        if(roundedMaxLossLong >= roundedMaxLossShort){
            roundedMaxLoss = roundedMaxLossLong
        } else {
            roundedMaxLoss = roundedMaxLossShort
        }
        if (roundedMaxLoss.maxLoss || (roundedMaxLoss.maxLoss === 0 && roundedMaxLoss.maxLoss !== null)) {
            res.status(200).json({maxLoss: roundedMaxLoss.maxLoss, maxLossPercentage: roundedMaxLoss.maxLossPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Loss Tb4 ASC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get profit to initial balance asc
/**
 * @openapi
 * tags:
 *  - name: tradingBot3Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_asc_trades/profit:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves profit for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of profit for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profit:
 *                     type: number
 *                     description: The global profit for current trading period (calculated value in percent).
 *                     example: 189
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_asc_trades/profit', async (req, res) => {
    try {
        const profit = await getPercentageProfitFromTrading(tb1DataAsc, tb4TradesAsc)
        if (profit) {
            res.status(200).json({profit: profit});
        } else {
            res.status(404).json({ message: "Cannot Get Profit To Initial Balance Tb4 ASC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Get all dsc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves all BTC-USD trades in DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Array of BTC-USD trades in DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the data point.
 *                     example: "2020-10-01"
 *                   balance:
 *                     type: number
 *                     description: The balance at current closing position.
 *                     example: 106.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades', async (req, res) => {
    try {
        const longData = await getFinalBalanceValues('CLOSE', tb4TradesDsc)
        const shortData = await getFinalBalanceValues('COVER', tb4TradesDsc)
        const data = longData.concat(shortData);
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Trades Tb4 DSC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get mdd dsc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb1/btcusd_emarsiobv_tb4_dsc_trades/mdd:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves MDD for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object MDD for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxDrawdown:
 *                     type: number
 *                     description: MDD for current period (value is calculated in %).
 *                     example: 6.45
 *                   maxMonetaryLoss:
 *                     type: number
 *                     description: Monetary loss for current period.
 *                     example: 13.67
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/mdd', async (req, res) => {
    try {
        const mdd = await getMdd(['CLOSE', 'COVER'], tb4TradesDsc)
        if (mdd.maxDrawdown && mdd.maxMonetaryLoss) {
            res.status(200).json(mdd);
        } else {
            res.status(404).json({ message: "Cannot Get Mdd Tb4 DSC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get longest trades dsc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/longest-trade:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Longest trade for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object Longest trade for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tradeType:
 *                     type: string
 *                     description: The type of trade.
 *                     example: "LONG"
 *                   start:
 *                     type: string
 *                     format: date
 *                     description: The start date of the data point.
 *                     example: "2020-10-01 00:00:00"
 *                   end:
 *                     type: string
 *                     format: date
 *                     description: The end date of the data point.
 *                     example: "2020-10-22 00:00:00"
 *                   duration:
 *                     type: number
 *                     description: Duration of longest trade.
 *                     example: 7
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/longest-trade', async (req, res) => {
    try {
        const longestLong = await calculateLongestTrade('LONG', 'CLOSE', tb4TradesDsc);
        const longestShort = await calculateLongestTrade('SHORT', 'COVER', tb4TradesDsc);
        const longestTrades = []
        if(longestLong){
            longestTrades.push(longestLong)
        }
        if(longestShort){
        longestTrades.push(longestShort)
        }
        if (longestTrades) {
            res.status(200).json(longestTrades);
        } else {
            res.status(404).json({ message: "Cannot Get Longest Trade Tb4 DSC" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get aggregate dsc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/unique-trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Unique trades for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of Unique trades for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 *                     description: The count of trade.
 *                     example: 33
 *                   trade:
 *                     type: string
 *                     description: The specifi trade.
 *                     example: "BUY"
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/unique-trades', async (req, res) => {
    try {
        const tradeCounts = await getUniqueTrades(tb4TradesDsc)
        if (tradeCounts) {
            res.status(200).json(tradeCounts);
        } else {
            res.status(404).json({ message: "Cannot Get Unique Trades Tb4 DSC." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get earned dsc trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/earned:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves earned values for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of earned values for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   holdingEarn:
 *                     type: number
 *                     description: Hold earn from starting point represented at the end point.
 *                     example: 441
 *                   tradingEarn:
 *                     type: number
 *                     description: Trading earn from starting point represented at the end point.
 *                     example: 653
 *                   holdTradeDiff:
 *                     type: number
 *                     description: Difference between traded and earned money.
 *                     example: 132
 *                   holdTradePercentageDiff:
 *                     type: number
 *                     description: Difference between traded and earned money in %.
 *                     example: 27
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/earned', async (req, res) => {
    try {
        const data = await getTradesEarnings(tb1DataDsc, tb4TradesDsc)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 DSC." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
//Get last balance dsc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/last-balance:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves last balance for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of last balance for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   balance:
 *                     type: number
 *                     description: The last balance in trading period.
 *                     example: 441
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/last-balance', async (req, res) => {
    try {
        const balance = await getLastBalance(tb4TradesDsc)
        if (balance) {
            res.status(200).json({balance: Number(balance)})
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 DSC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
//Get maximum gain dsc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/maximum-gain:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum gain for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum gain for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxGain:
 *                     type: number
 *                     description: The trade with the most gain.
 *                     example: 24
 *                   maxGainPercentage:
 *                     type: number
 *                     description: The percentage value of increased balance by this trade.
 *                     example: 12.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/maximum-gain', async (req, res) => {
    try {
        const roundedMaxGainLong = await getMaximumGain('LONG', 'CLOSE', tb4TradesDsc)
        const roundedMaxGainShort = await getMaximumGain('SHORT', 'COVER', tb4TradesDsc)
        let roundedMaxGain;
        if(roundedMaxGainLong >= roundedMaxGainShort){
            roundedMaxGain = roundedMaxGainLong
        } else {
            roundedMaxGain = roundedMaxGainShort
        }
        if (roundedMaxGain) {
            res.status(200).json({maxGain: roundedMaxGain.maxGain, maxGainPercentage: roundedMaxGain.maxGainPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Gain Tb4 DSC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get maximum loss dsc
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/maximum-loss:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum loss for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum loss for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxLoss:
 *                     type: number
 *                     description: The trade with the biggest loss.
 *                     example: 28
 *                   maxLossPercentage:
 *                     type: number
 *                     description: The percentage value of decreased balance by this trade.
 *                     example: 33.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/maximum-loss', async (req, res) => {
    try {
        const roundedMaxLossLong = await getMaximumLoss('LONG', 'CLOSE', tb4TradesDsc)
        const roundedMaxLossShort = await getMaximumLoss('SHORT', 'COVER', tb4TradesDsc)
        let roundedMaxLoss;
        if(roundedMaxLossLong >= roundedMaxLossShort){
            roundedMaxLoss = roundedMaxLossLong
        } else {
            roundedMaxLoss = roundedMaxLossShort
        }
        if (roundedMaxLoss.maxLoss || (roundedMaxLoss.maxLoss === 0 && roundedMaxLoss.maxLoss !== null)) {
            res.status(200).json({maxLoss: roundedMaxLoss.maxLoss, maxLossPercentage: roundedMaxLoss.maxLossPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Loss Tb4 DSC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get profit to initial balance dsc
/**
 * @openapi
 * tags:
 *  - name: tradingBot3Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_dsc_trades/profit:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves profit for DSC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of profit for DSC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profit:
 *                     type: number
 *                     description: The global profit for current trading period (calculated value in percent).
 *                     example: 189
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_dsc_trades/profit', async (req, res) => {
    try {
        const profit = await getPercentageProfitFromTrading(tb1DataDsc, tb4TradesDsc)
        if (profit) {
            res.status(200).json({profit: profit});
        } else {
            res.status(404).json({ message: "Cannot Get Profit To Initial Balance Tb4 DSC." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Get all stg trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves all BTC-USD trades in STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Array of BTC-USD trades in STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the data point.
 *                     example: "2020-10-01"
 *                   balance:
 *                     type: number
 *                     description: The balance at current closing position.
 *                     example: 106.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades', async (req, res) => {
    try {
        const longData = await getFinalBalanceValues('CLOSE', tb4TradesStg)
        const shortData = await getFinalBalanceValues('COVER', tb4TradesStg)
        const data = longData.concat(shortData);
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Trades Tb4 STG." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get mdd stg trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb1/btcusd_emarsiobv_tb4_stg_trades/mdd:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves MDD for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object MDD for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxDrawdown:
 *                     type: number
 *                     description: MDD for current period (value is calculated in %).
 *                     example: 6.45
 *                   maxMonetaryLoss:
 *                     type: number
 *                     description: Monetary loss for current period.
 *                     example: 13.67
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/mdd', async (req, res) => {
    try {
        const mdd = await getMdd(['CLOSE', 'COVER'], tb4TradesStg)
        if (mdd.maxDrawdown && mdd.maxMonetaryLoss) {
            res.status(200).json(mdd);
        } else {
            res.status(404).json({ message: "Cannot Get Mdd Tb4 STG." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get longest trades stg
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/longest-trade:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Longest trade for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object Longest trade for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tradeType:
 *                     type: string
 *                     description: The type of trade.
 *                     example: "LONG"
 *                   start:
 *                     type: string
 *                     format: date
 *                     description: The start date of the data point.
 *                     example: "2020-10-01 00:00:00"
 *                   end:
 *                     type: string
 *                     format: date
 *                     description: The end date of the data point.
 *                     example: "2020-10-22 00:00:00"
 *                   duration:
 *                     type: number
 *                     description: Duration of longest trade.
 *                     example: 7
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/longest-trade', async (req, res) => {
    try {
        const longestLong = await calculateLongestTrade('LONG', 'CLOSE', tb4TradesStg);
        const longestShort = await calculateLongestTrade('SHORT', 'COVER', tb4TradesStg);
        const longestTrades = []
        if(longestLong){
            longestTrades.push(longestLong)
        }
        if(longestShort){
        longestTrades.push(longestShort)
        }
        if (longestTrades) {
            res.status(200).json(longestTrades);
        } else {
            res.status(404).json({ message: "Cannot Get Longest Trade Tb4 STG" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get aggregate stg trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/unique-trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Unique trades for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of Unique trades for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 *                     description: The count of trade.
 *                     example: 33
 *                   trade:
 *                     type: string
 *                     description: The specifi trade.
 *                     example: "BUY"
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/unique-trades', async (req, res) => {
    try {
        const tradeCounts = await getUniqueTrades(tb4TradesStg)
        if (tradeCounts) {
            res.status(200).json(tradeCounts);
        } else {
            res.status(404).json({ message: "Cannot Get Unique Trades Tb4 STG." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get earned stg trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/earned:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves earned values for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of earned values for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   holdingEarn:
 *                     type: number
 *                     description: Hold earn from starting point represented at the end point.
 *                     example: 441
 *                   tradingEarn:
 *                     type: number
 *                     description: Trading earn from starting point represented at the end point.
 *                     example: 653
 *                   holdTradeDiff:
 *                     type: number
 *                     description: Difference between traded and earned money.
 *                     example: 132
 *                   holdTradePercentageDiff:
 *                     type: number
 *                     description: Difference between traded and earned money in %.
 *                     example: 27
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/earned', async (req, res) => {
    try {
        const data = await getTradesEarnings(tb1DataStg, tb4TradesStg)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 STG." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
//Get last balance stg
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/last-balance:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves last balance for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of last balance for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   balance:
 *                     type: number
 *                     description: The last balance in trading period.
 *                     example: 441
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/last-balance', async (req, res) => {
    try {
        const balance = await getLastBalance(tb4TradesStg)
        if (balance) {
            res.status(200).json({balance: Number(balance)})
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 STG." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
//Get maximum gain stg
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/maximum-gain:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum gain for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum gain for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxGain:
 *                     type: number
 *                     description: The trade with the most gain.
 *                     example: 24
 *                   maxGainPercentage:
 *                     type: number
 *                     description: The percentage value of increased balance by this trade.
 *                     example: 12.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/maximum-gain', async (req, res) => {
    try {
        const roundedMaxGainLong = await getMaximumGain('LONG', 'CLOSE', tb4TradesStg)
        const roundedMaxGainShort = await getMaximumGain('SHORT', 'COVER', tb4TradesStg)
        let roundedMaxGain;
        if(roundedMaxGainLong >= roundedMaxGainShort){
            roundedMaxGain = roundedMaxGainLong
        } else {
            roundedMaxGain = roundedMaxGainShort
        }
        if (roundedMaxGain) {
            res.status(200).json({maxGain: roundedMaxGain.maxGain, maxGainPercentage: roundedMaxGain.maxGainPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Gain Tb4 STG." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get maximum loss stg
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/maximum-loss:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum loss for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum loss for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxLoss:
 *                     type: number
 *                     description: The trade with the biggest loss.
 *                     example: 28
 *                   maxLossPercentage:
 *                     type: number
 *                     description: The percentage value of decreased balance by this trade.
 *                     example: 33.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/maximum-loss', async (req, res) => {
    try {
        const roundedMaxLossLong = await getMaximumLoss('LONG', 'CLOSE', tb4TradesStg)
        const roundedMaxLossShort = await getMaximumLoss('SHORT', 'COVER', tb4TradesStg)
        let roundedMaxLoss;
        if(roundedMaxLossLong >= roundedMaxLossShort){
            roundedMaxLoss = roundedMaxLossLong
        } else {
            roundedMaxLoss = roundedMaxLossShort
        }
        if (roundedMaxLoss.maxLoss || (roundedMaxLoss.maxLoss === 0 && roundedMaxLoss.maxLoss !== null)) {
            res.status(200).json({maxLoss: roundedMaxLoss.maxLoss, maxLossPercentage: roundedMaxLoss.maxLossPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Loss Tb4 STG." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get profit to initial balance stg
/**
 * @openapi
 * tags:
 *  - name: tradingBot3Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_stg_trades/profit:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves profit for STG period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of profit for STG period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profit:
 *                     type: number
 *                     description: The global profit for current trading period (calculated value in percent).
 *                     example: 189
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_stg_trades/profit', async (req, res) => {
    try {
        const profit = await getPercentageProfitFromTrading(tb1DataStg, tb4TradesStg)
        if (profit) {
            res.status(200).json({profit: profit});
        } else {
            res.status(404).json({ message: "Cannot Get Profit To Initial Balance Tb4 STG." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Get all com trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves all BTC-USD trades in COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Array of BTC-USD trades in COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the data point.
 *                     example: "2020-10-01"
 *                   balance:
 *                     type: number
 *                     description: The balance at current closing position.
 *                     example: 106.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades', async (req, res) => {
    try {
        const longData = await getFinalBalanceValues('CLOSE', tb4TradesCom)
        const shortData = await getFinalBalanceValues('COVER', tb4TradesCom)
        const data = longData.concat(shortData);
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Trades Tb4 COM." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get mdd com trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb1/btcusd_emarsiobv_tb4_com_trades/mdd:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves MDD for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object MDD for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxDrawdown:
 *                     type: number
 *                     description: MDD for current period (value is calculated in %).
 *                     example: 6.45
 *                   maxMonetaryLoss:
 *                     type: number
 *                     description: Monetary loss for current period.
 *                     example: 13.67
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/mdd', async (req, res) => {
    try {
        const mdd = await getMdd(['CLOSE', 'COVER'], tb4TradesCom)
        if (mdd.maxDrawdown && mdd.maxMonetaryLoss) {
            res.status(200).json(mdd);
        } else {
            res.status(404).json({ message: "Cannot Get Mdd Tb4 COM." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get longest trades com
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/longest-trade:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Longest trade for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object Longest trade for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tradeType:
 *                     type: string
 *                     description: The type of trade.
 *                     example: "LONG"
 *                   start:
 *                     type: string
 *                     format: date
 *                     description: The start date of the data point.
 *                     example: "2020-10-01 00:00:00"
 *                   end:
 *                     type: string
 *                     format: date
 *                     description: The end date of the data point.
 *                     example: "2020-10-22 00:00:00"
 *                   duration:
 *                     type: number
 *                     description: Duration of longest trade.
 *                     example: 7
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/longest-trade', async (req, res) => {
    try {
        const longestLong = await calculateLongestTrade('LONG', 'CLOSE', tb4TradesCom);
        const longestShort = await calculateLongestTrade('SHORT', 'COVER', tb4TradesCom);
        const longestTrades = []
        if(longestLong){
            longestTrades.push(longestLong)
        }
        if(longestShort){
        longestTrades.push(longestShort)
        }
        if (longestTrades) {
            res.status(200).json(longestTrades);
        } else {
            res.status(404).json({ message: "Cannot Get Longest Trade Tb4 COM" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get aggregate com trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/unique-trades:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves Unique trades for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of Unique trades for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: number
 *                     description: The count of trade.
 *                     example: 33
 *                   trade:
 *                     type: string
 *                     description: The specifi trade.
 *                     example: "BUY"
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/unique-trades', async (req, res) => {
    try {
        const tradeCounts = await getUniqueTrades(tb4TradesCom)
        if (tradeCounts) {
            res.status(200).json(tradeCounts);
        } else {
            res.status(404).json({ message: "Cannot Get Unique Trades Tb4 COM." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
// Get earned com trades
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/earned:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves earned values for ASC period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of earned values for ASC period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   holdingEarn:
 *                     type: number
 *                     description: Hold earn from starting point represented at the end point.
 *                     example: 441
 *                   tradingEarn:
 *                     type: number
 *                     description: Trading earn from starting point represented at the end point.
 *                     example: 653
 *                   holdTradeDiff:
 *                     type: number
 *                     description: Difference between traded and earned money.
 *                     example: 132
 *                   holdTradePercentageDiff:
 *                     type: number
 *                     description: Difference between traded and earned money in %.
 *                     example: 27
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/earned', async (req, res) => {
    try {
        const data = await getTradesEarnings(tb1DataCom, tb4TradesCom)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 COM." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
//Get last balance com
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/last-balance:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves last balance for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of last balance for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   balance:
 *                     type: number
 *                     description: The last balance in trading period.
 *                     example: 441
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/last-balance', async (req, res) => {
    try {
        const balance = await getLastBalance(tb4TradesCom)
        if (balance) {
            res.status(200).json({balance: Number(balance)})
        } else {
            res.status(404).json({ message: "Cannot Get Earned Data Tb4 COM." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
//Get maximum gain com
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/maximum-gain:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum gain for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum gain for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxGain:
 *                     type: number
 *                     description: The trade with the most gain.
 *                     example: 24
 *                   maxGainPercentage:
 *                     type: number
 *                     description: The percentage value of increased balance by this trade.
 *                     example: 12.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/maximum-gain', async (req, res) => {
    try {
        const roundedMaxGainLong = await getMaximumGain('LONG', 'CLOSE', tb4TradesCom)
        const roundedMaxGainShort = await getMaximumGain('SHORT', 'COVER', tb4TradesCom)
        let roundedMaxGain;
        if(roundedMaxGainLong >= roundedMaxGainShort){
            roundedMaxGain = roundedMaxGainLong
        } else {
            roundedMaxGain = roundedMaxGainShort
        }
        if (roundedMaxGain) {
            res.status(200).json({maxGain: roundedMaxGain.maxGain, maxGainPercentage: roundedMaxGain.maxGainPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Gain Tb4 COM." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get maximum loss com
/**
 * @openapi
 * tags:
 *  - name: tradingBot4Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/maximum-loss:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves maximum loss for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of maximum loss for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   maxLoss:
 *                     type: number
 *                     description: The trade with the biggest loss.
 *                     example: 28
 *                   maxLossPercentage:
 *                     type: number
 *                     description: The percentage value of decreased balance by this trade.
 *                     example: 33.48
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/maximum-loss', async (req, res) => {
    try {
        const roundedMaxLossLong = await getMaximumLoss('LONG', 'CLOSE', tb4TradesCom)
        const roundedMaxLossShort = await getMaximumLoss('SHORT', 'COVER', tb4TradesCom)
        let roundedMaxLoss;
        if(roundedMaxLossLong >= roundedMaxLossShort){
            roundedMaxLoss = roundedMaxLossLong
        } else {
            roundedMaxLoss = roundedMaxLossShort
        }
        if (roundedMaxLoss.maxLoss || (roundedMaxLoss.maxLoss === 0 && roundedMaxLoss.maxLoss !== null)) {
            res.status(200).json({maxLoss: roundedMaxLoss.maxLoss, maxLossPercentage: roundedMaxLoss.maxLossPercentage});
        } else {
            res.status(404).json({ message: "Cannot Get Maximum Loss Tb4 COM." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Get profit to initial balance com
/**
 * @openapi
 * tags:
 *  - name: tradingBot3Trades
 *    description: Trading bot 4 Trades
 * /api/tb4/btcusd_emarsiobv_tb4_com_trades/profit:
 *   get:
 *     tags:
 *       - tradingBot4Trades
 *     summary: Retrieves profit for COM period from Trading Bot 4
 *     responses:
 *       200:
 *         description: Object of profit for COM period from Trading Bot 4.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profit:
 *                     type: number
 *                     description: The global profit for current trading period (calculated value in percent).
 *                     example: 189
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_emarsiobv_tb4_com_trades/profit', async (req, res) => {
    try {
        const profit = await getPercentageProfitFromTrading(tb1DataCom, tb4TradesCom)
        if (profit) {
            res.status(200).json({profit: profit});
        } else {
            res.status(404).json({ message: "Cannot Get Profit To Initial Balance Tb4 COM." });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router