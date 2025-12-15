const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const app = express();
app.use(cors());


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];
let prices = {};


STOCKS.forEach(s => prices[s] = 100 + Math.random() * 500);


io.on("connection", socket => {
socket.on("subscribe", stock => {
socket.join(stock);
});
});


setInterval(() => {
STOCKS.forEach(stock => {
prices[stock] += (Math.random() - 0.5) * 5;
io.to(stock).emit("priceUpdate", {
stock,
price: prices[stock].toFixed(2)
});
});
}, 1000);


server.listen(4000, () => console.log("Backend running on port 4000"));