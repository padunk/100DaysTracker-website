require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes/api");

const APP = express();

const port = process.env.PORT || 5000;

APP.use(express.json());
APP.use(bodyParser.urlencoded({ extended: false }));
APP.use(cors());

if (process.env.NODE_ENV === "production") {
  APP.use(express.static(path.join(__dirname, "client/build")));
}

APP.use("/api", routes);

APP.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
