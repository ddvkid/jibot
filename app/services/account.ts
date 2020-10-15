import axios from 'axios';

const url = 'https://platform.rokt.com/api/accounts';
export async function getAccountInfo(accountId: string) {
  return axios.get(`${url}/${accountId}`);
}