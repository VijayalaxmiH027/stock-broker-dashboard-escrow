export const fetchStocks = async () => {
  const response = await fetch("https://YOUR_BACKEND_URL/api/stocks");
  return response.json();
};
