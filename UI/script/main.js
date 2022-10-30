const root = document.getElementById("root");
const { log, error } = console;

const getData = async (symbol, interval) => {
  const resp = await fetch(`http://127.0.0.1:3000/${symbol}/${interval}`);
  const data = await resp.json();
  return data;
};

const renderChart = async (symbol = "BTC", interval = "1") => {
  if (root.childElementCount) {
    root.removeChild(root.firstElementChild);
  }
  const chartProperties = {
    timScale: {
      timeVisible: true,
      secondVisible: true,
    },
  };
  log(chartProperties);
  const chart = LightweightCharts.createChart(root, chartProperties);
  const candlestickSeries = chart.addCandlestickSeries({ title: "Primary" });
  const klineData = await getData(symbol, interval);
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
  const rsiDomEle = document.querySelector("#rsi");
  const rsiChart = LightweightCharts.createChart(rsiDomEle, chartProperties);
  const rsi_series = rsiChart.addLineSeries({
    title: "RSI",
    color: "purple",
    lineWidth: 1,
  });

  const rsi_data = klineData
    .filter((d) => d.rsi)
    .map((d) => ({ time: d.time, value: d.rsi }));
  console.log(rsi_data);
  rsi_series.setData(rsi_data);
  //log(rsi_series)
};

renderChart();
const form = document.querySelector(".form");
form.onsubmit = (e) => {
  e.preventDefault();
  const { target } = e;
  const symbol = target[0].value;
  const interval = target[1].value;
  renderChart(symbol, interval);
  form.reset();
};
