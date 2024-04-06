const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Brand Shop server running");
});

app.listen(port, () => {
    console.log("Server is Running on port: ", port);
})