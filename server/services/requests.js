const axios = require('axios');

const url = 'https://platform.stage.rokt.com/api/accounts';
exports.getAccountInfo = async (accountId) => {
  return axios.get(`${url}/${accountId}`, {headers: {'Authorization': `Bearer ${process.env.JWT}`}})
    .then(res => res.data);
}

exports.getCampaignInfo = async (accountId) => {
  return axios.get(`${url}/${accountId}`, {headers: {'Authorization': `Bearer ${process.env.JWT}`}})
    .then(res => res.data);
}