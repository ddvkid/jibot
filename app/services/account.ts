import axios from 'axios';

const url = 'https://platform.stage.rokt.com/api/accounts';
export async function getAccountInfo(accountId: string) {
  return axios.get(`${url}/${accountId}`, {headers: {'Authorization': `Bearer ${process.env.JWT}`}});
}