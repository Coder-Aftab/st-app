const { log, error } = console;
import { targets } from "./allTargets.js";
const getData = async (symbol) => {
  try {
    const resp = await fetch(`http://localhost:3001/${symbol}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    log(error);
  }
};

//generate random targets coins
const newSymbol = Math.floor(Math.random() * targets.length);

//render Charts
const renderChart = async (symbol = "BTC") => {
  const root = document.getElementById("root");
  if (root.childElementCount) {
    root.removeChild(root.firstElementChild);
  }
  const chartProperties = {
    timScale: {
      timeVisible: true,
      secondVisible: true,
    },
    pane: 0,
  };

  const chart = LightweightCharts.createChart(root, chartProperties);
  const candlestickSeries = chart.addCandlestickSeries();
  //legend
  const toolTip = document.querySelector("#legend");
  toolTip.innerHTML = `<div style="font-size: 24px; margin: 4px 0px; color: #20262E"> ${targets[newSymbol]}</div>`;

  const klineData = await getData(targets[newSymbol]);
  candlestickSeries.setData(klineData);

  //SMA
  const sma_series = chart.addLineSeries({ color: "red", lineWidth: 1 });
  const sma_data = klineData
    .filter((d) => d.sma)
    .map((d, i) => ({ time: d.time, value: d.sma }));
  sma_series.setData(sma_data);
  //console.log(sma_data);
  //EMA
  const ema_series = chart.addLineSeries({ color: "green", lineWidth: 1 });
  const ema_data = klineData
    .filter((d) => d.ema)
    .map((d, i) => ({ time: d.time, value: d.ema }));
  ema_series.setData(ema_data);
  //console.log(sma_data);

  //Markers

  candlestickSeries.setMarkers(
    klineData
      .filter((d) => d.long || d.short)
      .map((d) => {
        return d.long
          ? {
              time: d.time,
              position: "belowBar",
              color: "green",
              text: "Long",
              shape: "arrowUp",
            }
          : {
              time: d.time,
              position: "aboveBar",
              color: "red",
              text: "Short",
              shape: "arrowDown",
            };
      })
  );
  //RSI
  const rsi_series = chart.addLineSeries({
    title: "RSI",
    color: "purple",
    lineWidth: 1,
    pane: 1,
  });

  const rsi_data = klineData
    .filter((d) => d.rsi)
    .map((d) => ({ time: d.time, value: d.rsi }));
  //log(rsi_data);
  rsi_series.setData(rsi_data);
  //log(rsi_series)
  //MACD FAST
  const macd_fast_series = chart.addLineSeries({
    title: "macd",
    color: "blue",
    lineWidth: 1,
    pane: 2,
  });
  const macd_fast_data = klineData
    .filter((d) => d.macd_fast)
    .map((d) => ({ time: d.time, value: d.macd_fast }));
  macd_fast_series.setData(macd_fast_data);
  //MACD SLOW
  const macd_slow_series = chart.addLineSeries({
    color: "red",
    lineWidth: 1,
    pane: 2,
  });
  const macd_slow_data = klineData
    .filter((d) => d.macd_slow)
    .map((d) => ({ time: d.time, value: d.macd_slow }));
  macd_slow_series.setData(macd_slow_data);
  //MACD HISTOGRAM
  const macd_histogram_series = chart.addHistogramSeries({
    pane: 2,
  });
  const macd_histogram_data = klineData
    .filter((d) => d.macd_histogram)
    .map((d) => ({
      time: d.time,
      value: d.macd_histogram,
      color: d.macd_histogram > 0 ? "green" : "red",
    }));
  macd_histogram_series.setData(macd_histogram_data);
};

renderChart();
// const form = document.querySelector(".form");
// form.onsubmit = (e) => {
//   e.preventDefault();
//   const { target } = e;
//   const symbol = target[0].value;
//   const interval = target[1].value;
//   renderChart(symbol, interval);
//   form.reset();
// };
