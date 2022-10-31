const { log } = console;

const domEle = document.querySelector("#root");

const getData = async () => {
  const res = await fetch("http://127.0.0.1:4000/");
  const data = await res.json();
  return data;
};



const renderChart = async () => {
  const data = await getData();
  const chartProperties = {
    timScale: {
      timeVisible: true,
      secondVisible: true,
    },
  };
  const chart = LightweightCharts.createChart(domEle, chartProperties);
  const stock_series = chart.addCandlestickSeries({ title: 'SBIN' });
  stock_series.setData(data);
};

renderChart();