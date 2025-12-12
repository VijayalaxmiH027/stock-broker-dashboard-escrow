export default function StockCard({ stock }) {
  return (
    <div className="card">
      <h3>{stock.symbol}</h3>
      <p>Price: ${stock.price}</p>
      <p>Change: {stock.change}</p>
    </div>
  );
}
