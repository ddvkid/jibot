const axios = require('axios');

const url = 'https://platform.stage.rokt.com';
exports.getAccountInfo = async (accountId) => {
  return axios.get(`${url}/api/accounts/${accountId}`, {headers: {'Authorization': `Bearer ${process.env.JWT}`}})
    .then(res => res.data);
}
