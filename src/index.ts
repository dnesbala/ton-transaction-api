import express from "express";
import { initDB } from "./config/db";

const startApp = async () => {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.get("/api/transactions/", async (req, res): Promise<any> => {
    const { accountAddress, date } = req.query;

    if (!accountAddress) {
      return res.status(400).json({
        "status-code": -1,
        "status-message": "Missing accountAddress",
      });
    }

    // Check on DB if transaction upto that date is available or not
    try {
      const em = (await initDB()).em.fork();

      const filters: any = { accountAddress };

      if (date) {
        filters.timestamp = {
          $lte: new Date(date as string),
        };
      }

      const dbTransactions = await em.find("Transaction", filters);

      if (dbTransactions.length > 0) {
        return res.status(200).json({
          "status-code": 1,
          "status-message": "Transactions fetched successfully",
          data: dbTransactions,
        });
      }

      // If not, Fetch data from TON Center and udpate DB
      const response = await fetch(
        `https://testnet.toncenter.com/api/v3/transactions?account=${accountAddress}&limit=128&offset=0&sort=desc`
      );

      if (!response.ok) {
        throw new Error("TonCenter Transaction API Failure");
      }

      const data = await response.json();

      // store on db and return data
      return res.status(200).json({
        "status-code": 1,
        "status-message": "Transactions fetched successfully",
        data: data?.transactions ?? [],
      });
    } catch (err) {
      console.log("Error fetching transactions:", err);
      return res.status(500).json({
        "status-code": -1,
        "status-message": "Error fetching transactions",
        error: err,
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
};

startApp();
