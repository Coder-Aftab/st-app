const { log, error } = console;

const getData = async (symbol, interval) => {
  try {
    const resp = await fetch(`http://127.0.0.1:3001/BTC/1`);
    const data = await resp.json();
    return data;
  } catch (error) {
    alert("Please enter correct input", error);
  }
};

const renderChart = async (symbol = "BTC", interval = "1") => {
  const root = document.getElementById("root");
  if (root.childElementCount) {
    root.removeChild(root.firstElementChild);
  }
  const chartProperties = {
    timScale: {
      timeVisible: true,
      secondVisible: true,
    },
    pane:0,
  };

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
  const rsi_series = chart.addLineSeries({
    title: "RSI",
    color: "purple",
    lineWidth: 1,
    pane:1,
  });

  const rsi_data = klineData
    .filter((d) => d.rsi)
    .map((d) => ({ time: d.time, value: d.rsi }));
  //log(rsi_data);
  rsi_series.setData(rsi_data);
  //log(rsi_series)
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


// const renderChart = async () => {
//   const chartProperties = {
//     timeScale: {
//       timeVisible: true,
//       secondsVisible: true,
//     },
//     pane: 0,
//   };
//   const domElement = document.getElementById('root');
//   const chart = LightweightCharts.createChart(domElement, chartProperties);
//   const candleseries = chart.addCandlestickSeries();
//   const klinedata = await getData();
//   candleseries.setData(klinedata);
//   //SMA
//   const sma_series = chart.addLineSeries({ color: 'red', lineWidth: 1 });
//   const sma_data = klinedata
//     .filter((d) => d.sma)
//     .map((d) => ({ time: d.time, value: d.sma }));
//   sma_series.setData(sma_data);
//   //EMA
//   const ema_series = chart.addLineSeries({ color: 'green', lineWidth: 1 });
//   const ema_data = klinedata
//     .filter((d) => d.ema)
//     .map((d) => ({ time: d.time, value: d.ema }));
//   ema_series.setData(ema_data);
//   //MARKERS
//   candleseries.setMarkers(
//     klinedata
//       .filter((d) => d.long || d.short)
//       .map((d) =>
//         d.long
//           ? {
//             time: d.time,
//             position: 'belowBar',
//             color: 'green',
//             shape: 'arrowUp',
//             text: 'LONG',
//           }
//           : {
//             time: d.time,
//             position: 'aboveBar',
//             color: 'red',
//             shape: 'arrowDown',
//             text: 'SHORT',
//           }
//       )
//   );
//   //RSI
//   const rsi_series = chart.addLineSeries({
//     color: 'purple',
//     lineWidth: 1,
//     pane: 1,
//   });
//   const rsi_data = klinedata
//     .filter((d) => d.rsi)
//     .map((d) => ({ time: d.time, value: d.rsi }));
//   rsi_series.setData(rsi_data);
// }

// renderChart();