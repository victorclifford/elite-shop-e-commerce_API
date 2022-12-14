require("dotenv").config();
const express = require("express");
const connectDB = require("./conn");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

const origin = ["http://localhost:3000"];
const app = express();

// middlewares
// Add Access Control Allow Origin headers
app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>server running...</h1>");
  //   console.log(req);
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 4000, () => {
      console.log("server started on port 4000...");
    });
  } catch (error) {
    console.log(error);
    process(1);
  }
};
startServer();
