import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import "./styles.css";


const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];


export default function App() {
const [email, setEmail] = useState("");
const [loggedIn, setLoggedIn] = useState(false);
const [prices, setPrices] = useState({});


useEffect(() => {
socket.on("priceUpdate", data => {
setPrices(p => ({ ...p, [data.stock]: data.price }));
});
}, []);


const subscribe = stock => socket.emit("subscribe", stock);


if (!loggedIn)
return (
<div className="login">
<h2>Stock Broker Dashboard</h2>
<input placeholder="Email" onChange={e => setEmail(e.target.value)} />
<button onClick={() => setLoggedIn(true)}>Login</button>
</div>
);


return (
<div className="dashboard">
<h3>Welcome {email}</h3>
{STOCKS.map(s => (
<div key={s} className="card">
<h4>{s}</h4>
<p>₹ {prices[s] || "--"}</p>
<button onClick={() => subscribe(s)}>Subscribe</button>
}