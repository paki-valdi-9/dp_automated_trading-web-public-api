const { getInitialBalance, getMarketData, getMarketPeriod } = require("../dataServices")

const express = require('express')
const router = express.Router()

const tb1DataAsc = require('../../models/tradingBot1/Data/asc') 
const tb1DataDsc = require('../../models/tradingBot1/Data/dsc') 
const tb1DataStg = require('../../models/tradingBot1/Data/stg') 
const tb1DataCom = require('../../models/tradingBot1/Data/com') 

//Get initial balance
/**
 * @openapi
 * tags:
 *  - name: initial
 *    description: Initial operations
 * /api/data/initial_balance:
 *   get:
 *     tags:
 *       - initial
 *     summary: Retrieves the initial balance
 *     responses:
 *       200:
 *         description: Initial balance of Trading Analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 initial_balance:
 *                   type: number
 *                   description: The initial balance of Trading Analytics
 *                   example: 369
 *       404:
 *         description: Initial balance not found.
 *       500:
 *         description: Server error.
 */
router.get('/initial_balance', async (req, res) => {
    try {
        const data = await getInitialBalance(tb1DataAsc)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Initial Balance Tb1." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})

/*** Trading Bot 1 Data ***/
// Get all asc data
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_asc_datas:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves OHLC data for BTC/USD for an ASC period from Trading Bot 1
 *     responses:
 *       200:
 *         description: Array of OHLC market data points for BTC/USD.
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
 *                   open:
 *                     type: number
 *                     description: The opening price.
 *                     example: 10795.25488
 *                   high:
 *                     type: number
 *                     description: The highest price during the period.
 *                     example: 10933.62402
 *                   low:
 *                     type: number
 *                     description: The lowest price during the period.
 *                     example: 10472.35645
 *                   close:
 *                     type: number
 *                     description: The closing price.
 *                     example: 10619.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_asc_datas', async (req, res) => {
    try {
        const data = await getMarketData(tb1DataAsc)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Market Data Tb1 ASC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get asc period
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_asc_datas/period:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves the period of available OHLC data for BTC/USD for an ASC period from Trading Bot 1
 *     responses:
 *       200:
 *         description: The period for which OHLC market data is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   format: date
 *                   description: The start date of the data.
 *                   example: "2020-01-01"
 *                 to:
 *                   type: string
 *                   format: date
 *                   description: The end date of the data.
 *                   example: "2020-12-31"
 *       404:
 *         description: Market period data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_asc_datas/period', async (req, res) => {
    try {
        const period = await getMarketPeriod(tb1DataAsc)
        if (period) {
            res.status(200).json(period)
        } else {
            res.status(404).json({ message: "Cannot Get Market Period Tb1 ASC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get all dsc data
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_dsc_datas:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves OHLC data for BTC/USD for an DSC period from Trading Bot 1
 *     responses:
 *       200:
 *         description: Array of OHLC market data points for BTC/USD.
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
 *                   open:
 *                     type: number
 *                     description: The opening price.
 *                     example: 10795.25488
 *                   high:
 *                     type: number
 *                     description: The highest price during the period.
 *                     example: 10933.62402
 *                   low:
 *                     type: number
 *                     description: The lowest price during the period.
 *                     example: 10472.35645
 *                   close:
 *                     type: number
 *                     description: The closing price.
 *                     example: 10619.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_dsc_datas', async (req, res) => {
    try {
        const data = await getMarketData(tb1DataDsc)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Market Data Tb1 DSC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get dsc period
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_dsc_datas/period:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves the period of available OHLC data for BTC/USD for an DSC period from Trading Bot 1
 *     responses:
 *       200:
 *         description: The period for which OHLC market data is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   format: date
 *                   description: The start date of the data.
 *                   example: "2020-01-01"
 *                 to:
 *                   type: string
 *                   format: date
 *                   description: The end date of the data.
 *                   example: "2020-12-31"
 *       404:
 *         description: Market period data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_dsc_datas/period', async (req, res) => {
    try {
        const period = await getMarketPeriod(tb1DataDsc)
        if (period) {
            res.status(200).json(period)
        } else {
            res.status(404).json({ message: "Cannot Get Market Period Tb1 DSC." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get all stg data
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_stg_datas:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves OHLC data for BTC/USD for an STG period from Trading Bot 1
 *     responses:
 *       200:
 *         description: Array of OHLC market data points for BTC/USD.
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
 *                   open:
 *                     type: number
 *                     description: The opening price.
 *                     example: 10795.25488
 *                   high:
 *                     type: number
 *                     description: The highest price during the period.
 *                     example: 10933.62402
 *                   low:
 *                     type: number
 *                     description: The lowest price during the period.
 *                     example: 10472.35645
 *                   close:
 *                     type: number
 *                     description: The closing price.
 *                     example: 10619.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_stg_datas', async (req, res) => {
    try {
        const data = await getMarketData(tb1DataStg)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Market Data Tb1 STG." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get stg period
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_stg_datas/period:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves the period of available OHLC data for BTC/USD for an STG period from Trading Bot 1
 *     responses:
 *       200:
 *         description: The period for which OHLC market data is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   format: date
 *                   description: The start date of the data.
 *                   example: "2020-01-01"
 *                 to:
 *                   type: string
 *                   format: date
 *                   description: The end date of the data.
 *                   example: "2020-12-31"
 *       404:
 *         description: Market period data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_stg_datas/period', async (req, res) => {
    try {
        const period = await getMarketPeriod(tb1DataStg)
        if (period) {
            res.status(200).json(period)
        } else {
            res.status(404).json({ message: "Cannot Get Market Period Tb1 STG." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get all com data
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_com_datas:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves OHLC data for BTC/USD for an COM period from Trading Bot 1
 *     responses:
 *       200:
 *         description: Array of OHLC market data points for BTC/USD.
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
 *                   open:
 *                     type: number
 *                     description: The opening price.
 *                     example: 10795.25488
 *                   high:
 *                     type: number
 *                     description: The highest price during the period.
 *                     example: 10933.62402
 *                   low:
 *                     type: number
 *                     description: The lowest price during the period.
 *                     example: 10472.35645
 *                   close:
 *                     type: number
 *                     description: The closing price.
 *                     example: 10619.45215
 *       404:
 *         description: Market data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_com_datas', async (req, res) => {
    try {
        const data = await getMarketData(tb1DataCom)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Cannot Get Market Data Tb1 COM." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})
// Get com period
/**
 * @openapi
 * tags:
 *  - name: data
 *    description: Data operations
 * /api/data/btcusd_tb1_com_datas/period:
 *   get:
 *     tags:
 *       - data
 *     summary: Retrieves the period of available OHLC data for BTC/USD for an COM period from Trading Bot 1
 *     responses:
 *       200:
 *         description: The period for which OHLC market data is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   format: date
 *                   description: The start date of the data.
 *                   example: "2020-01-01"
 *                 to:
 *                   type: string
 *                   format: date
 *                   description: The end date of the data.
 *                   example: "2020-12-31"
 *       404:
 *         description: Market period data not found.
 *       500:
 *         description: Server error.
 */
router.get('/btcusd_tb1_com_datas/period', async (req, res) => {
    try {
        const period = await getMarketPeriod(tb1DataCom)
        if (period) {
            res.status(200).json(period)
        } else {
            res.status(404).json({ message: "Cannot Get Market Period Tb1 COM." });
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})

module.exports = router;