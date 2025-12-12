import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Supported Stocks
const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

// File to store subscriptions
const SUB_FILE = "./subscriptions.json";

// Load subscriptions from file
let userSubscriptions = {};
let emailToSockets = {};

if (fs.existsSync(SUB_FILE)) {
    const data = fs.readFileSync(SUB_FILE, "utf-8");
    userSubscriptions = JSON.parse(data);
}

// Helper to save subscriptions to file
function saveSubscriptions() {
    fs.writeFileSync(SUB_FILE, JSON.stringify(userSubscriptions, null, 2));
}

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    // Subscribe to stock
    socket.on("subscribe", ({ email, ticker }) => {
        if (!SUPPORTED_STOCKS.includes(ticker)) return;

        // Map email to multiple sockets
        if (!emailToSockets[email]) emailToSockets[email] = [];
        if (!emailToSockets[email].includes(socket.id)) {
            emailToSockets[email].push(socket.id);
        }

        // Store subscription
        if (!userSubscriptions[email]) userSubscriptions[email] = [];
        if (!userSubscriptions[email].includes(ticker)) {
            userSubscriptions[email].push(ticker);
            saveSubscriptions();
        }

        console.log(`${email} subscribed to ${ticker}`);
    });

    // Send current subscriptions on login
    socket.on("getSubscriptions", (email) => {
        const subscriptions = userSubscriptions[email] || [];
        socket.emit("currentSubscriptions", subscriptions);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (const email in emailToSockets) {
            emailToSockets[email] = emailToSockets[email].filter(id => id !== socket.id);
            if (emailToSockets[email].length === 0) {
                delete emailToSockets[email];
            }
        }
    });
});

// Random Stock Price Generator
setInterval(() => {
    SUPPORTED_STOCKS.forEach(stock => {
        const price = (Math.random() * 1000 + 100).toFixed(2);

        for (const email in userSubscriptions) {
            if (userSubscriptions[email].includes(stock)) {
                const sockets = emailToSockets[email] || [];
                sockets.forEach(socketId => {
                    io.to(socketId).emit("priceUpdate", { stock, price });
                });
            }
        }
    });
}, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Backend running on port", PORT));
