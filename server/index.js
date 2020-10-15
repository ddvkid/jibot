const { getAccountInfo } = require("./services/requests");
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 1124;

const app = express()
  .use(express.urlencoded({extended: false}))
  .use(express.json());

app.get('/account/:id', async (req, res) => {
  const accountInfo = await getAccountInfo(req.params.id);
  return res.json(accountInfo);
});

app.get('/campaign', async (req, res) => {
  console.log(req.queryParam);
  const accountInfo = await getAccountInfo(req.params.id);
  return res.json(accountInfo);
});

app.listen(PORT, () => {
  console.log(`Server is running in port - ${PORT}`);
});