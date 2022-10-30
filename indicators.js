const { log } = console;
const tulind = require("tulind");
const util = require("util");

const sma_aysnc = util.promisify(tulind.indicators.sma.indicator);
const ema_aysnc = util.promisify(tulind.indicators.ema.indicator);
const rsi_aysnc = util.promisify(tulind.indicators.rsi.indicator);

const sma_inc = async (data) => {
  const d1 = data.map((d) => d.close);
  const res = await sma_aysnc([d1], [100]);
  const d2 = res[0];
  const diff = data.length - d2.length;
  const emptyArray = [...new Array(diff)].map((d) => "");
  const d3 = [...emptyArray, ...d2];
  data = data.map((d, i) => ({ ...d, sma: d3[i] }));
  return data;
};

const ema_inc = async (data) => {
  const d1 = data.map((d) => d.open);
  const res = await ema_aysnc([d1], [21]);
  const d2 = res[0];
  const diff = data.length - d2.length;
  const emptyArray = [...new Array(diff)].map((d) => "");
  const d3 = [...emptyArray, ...d2];
  data = data.map((d, i) => ({ ...d, ema: d3[i] }));
  return data;
};

const markers_inc = async (data) => {
  data = data.map((d, i, arr) => {
    const long =
      arr[i]?.ema > arr[i]?.sma && arr[i - 1]?.ema < arr[i - 1]?.sma
        ? true
        : false;
    const short =
      arr[i]?.ema < arr[i]?.sma && arr[i - 1]?.ema > arr[i - 1]?.sma
        ? true
        : false;

    return { ...d, long, short };
  });
  return data;
};

const rsi_inc = async (data) => {
  const d1 = data.map((d) => d.open);
  const res = await rsi_aysnc([d1], [21]);
  const d2 = res[0];
  const diff = data.length - d2.length;
  const emptyArray = [...new Array(diff)].map((d) => "");
  const d3 = [...emptyArray, ...d2];
  data = data.map((d, i) => ({ ...d, rsi: d3[i] }));
  return data;
};

module.exports = { sma_inc, ema_inc, markers_inc, rsi_inc };
