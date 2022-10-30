
const data = require('./SBIN.json');
const express = require("express");
const app = express();
const cors = require("cors");
const server = app.listen(4000, console.log("API is Up and Running at port 4000"));

//Creating API values;
const open = Object.values(data.Open);
const high = Object.values(data.High);
const close = Object.values(data.Close);
const low = Object.values(data.Low);
const time= Object.keys(data.Symbol);
const nData = [];
for (let i = 0; i < open.length; i++){
  nData.push({
    time:time[i]/1000,
    open: open[i]*1,
    high: close[i]*1,
    low: low[i]*1,
    close:close[i]*1
  })
}

app.get('/', async (req, res) => {
  try {
      res.status(200).json(nData)
  }
  catch (err) {
    res.status(500).send("Internal Server Error")
  }
})

// console.log(nData);
