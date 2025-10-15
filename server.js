import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// Reliable Yahoo symbols
const INDEX_SYMBOLS = {
  sensex: "^BSESN",
  nifty: "^NSEI",
  banknifty: "^NSEBANK",
  midcapnifty: "^NSEMDCP",  // Nifty Midcap 100
  finnifty: "^NSEFIN",      // FinNifty
  gold: "GC=F"
};

app.get("/api/market/:index", async (req, res) => {
  try {
    const symbol = INDEX_SYMBOLS[req.params.index.toLowerCase()];
    if (!symbol) return res.status(400).json({ error: "Invalid index" });

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
    );

    const price = response.data?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;

    if (price === null) return res.status(500).json({ error: "No price found" });

    res.json({ symbol, price });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch Yahoo data" });
  }
});

app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
