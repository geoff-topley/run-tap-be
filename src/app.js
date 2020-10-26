const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const axios = require("axios");
require("dotenv").config();

const app = express();
const router = express.Router();

router.get("/sessionData", (req, res) => {
  if (process.env.ENVIRONMENT == "production") {
    const code = req.query.code;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const url = `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;

    axios
      .post(url)
      .then((response) => res.send(JSON.stringify(response.data)))
      .catch((error) => res.send(error));
  } else {
    res.json({ msg: "Testing Local Lambda - Success" });
  }
});

const domain =
  process.env.ENVIRONMENT == "production"
    ? "https://run-tap.netlify.app/"
    : "http://localhost:3000";

app.use(
  cors({
    origin: domain,
    methods: "GET",
  })
);

app.use("/.netlify/functions/app", router);

// allows lambda to run
module.exports.handler = serverless(app);
