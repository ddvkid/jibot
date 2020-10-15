import axios from 'axios';

const url = `${process.env.LOCAL_URL || 'https://4d31da0a29a6.ngrok.io'}/account`;
export async function getAccountInfo(accountId: string) {
  return axios.get(`${url}/${accountId}`)
    .then(res => res.data);
}