import express from "express";
import bodyParser from "body-parser";
import callsRoutes from "./routes/callsRoutes.js";

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/calls", callsRoutes);

// Healthcheck
app.get("/", (req, res) => {
  res.send("MCP Server running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`MCP Server running on port ${PORT}`));
