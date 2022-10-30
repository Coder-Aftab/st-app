const log = console.log;
const { json } = require("express");
const express = require("express");
const app = express();
const got = require("got");
const cors = require("cors");

//SMA

const { sma_inc, ema_inc, markers_inc, rsi_inc } = require("./indicators");

const server = app.listen(3000, log("Proxy Server Running on Port 3000"));
app.get("/", (_, res) => res.status(200).send("Proxy Server Works"));
app.use(cors());
app.get("/:symbol/:interval", async (req, res) => {
  try {
    const { symbol, interval } = req.params;
    const resp = await got(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}m`
    );
    const data = JSON.parse(resp.body);
    let klineData = data.map((d) => ({
      time: d[0] / 1000,
      open: d[1] * 1,
      high: d[2] * 1,
      low: d[3] * 1,
      close: d[4] * 1,
    }));
    // console.log(resp.body);
    //SMA
    klineData = await sma_inc(klineData);
    //EMA
    klineData = await ema_inc(klineData);
    //Marker
    klineData = await markers_inc(klineData);
    klineData = await rsi_inc(klineData);
    res.status(200).json(klineData);
  } catch (err) {
    res.status(500).send(err);
  }
});
