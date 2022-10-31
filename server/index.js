const log = console.log;
const { json } = require("express");
const express = require("express");
const app = express();
const got = require("got");
const cors = require("cors");

//import indicators

const {
  sma_inc,
  ema_inc,
  markers_inc,
  rsi_inc,
  macd_inc,
} = require("./indicators");
app.use(cors());
app.get("/", (_, res) => res.status(200).send("Proxy Server Works"));
app.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const resp = await got(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1m`
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
    klineData = await macd_inc(klineData);
    res.status(200).json(klineData);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.Port || 5000, () => {
  log(`Proxy Server Running `);
});
