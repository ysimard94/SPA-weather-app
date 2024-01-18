const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: 8081,
  API_KEY: process.env.API_KEY,
};
