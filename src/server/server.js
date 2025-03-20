const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swaggerDef");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, "../../.env.local"),
  });
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const corsOptions = {
  origin: [
    "https://dp-automated-trading-web-public-api.onrender.com/",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }), express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Backend is running. To see swagger go to /api-docs and test it out."
    );
});

const dataRouter = require("./routes/TradingBot1/data");
const tradesBt1Router = require("./routes/TradingBot1/trades");
const tradesBt2Router = require("./routes/TradingBot2/trades");
const tradesBt3Router = require("./routes/TradingBot3/trades");
const tradesBt4Router = require("./routes/TradingBot4/trades");

app.use("/api/data", dataRouter);
app.use("/api/tb1", tradesBt1Router);
app.use("/api/tb2", tradesBt2Router);
app.use("/api/tb3", tradesBt3Router);
app.use("/api/tb4", tradesBt4Router);

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
