const { getAccountInfo } = require("./services/account");
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 1124;

const app = express()
  .use(express.urlencoded({extended: false}))
  .use(express.json());

app.get('/lookup', async (req, res) => {
  const accountInfo = await getAccountInfo('1');
  return res.json(accountInfo);
});

app.listen(PORT, () => {
  console.log(`Server is running in port - ${PORT}`);
});