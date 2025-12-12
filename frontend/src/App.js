import { useEffect, useState } from "react";
import StockCard from "./components/StockCard";
import { fetchStocks } from "./services/api";

function App() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  return (
    <div>
      <h1>Stock Broker Dashboard</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {stocks.map((s) => (
          <StockCard key={s.symbol} stock={s} />
        ))}
      </div>
    </div>
  );
}

export default App;
