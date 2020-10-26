const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios");
const app = express();
const router = express.Router();
require("dotenv").config();

app.use("/.netlify/functions/app", router, function (req, res, next) {

  // header indicates whether the response can be shared with requesting code from the given origin.
  const domain =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : "https://run-tap.netlify.app/";
  res.header("Access-Control-Allow-Origin", domain);

  // set header values to resolve CORS issues
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

router.get("/sessionData", (req, res) => {
  const code = req.query.code;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  
  const url = `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;

  axios
    .post(url)
    .then((response) => res.send(JSON.stringify(response.data)))
    .catch((error) => res.send(error));
});

// allows lambda to run
module.exports.handler = serverless(app);
