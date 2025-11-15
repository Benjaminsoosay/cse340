// src/server.js
const express = require("express");
const app = express();
const inventoryRoute = require("./routes/inventoryRoute");

app.use("/", inventoryRoute); 
