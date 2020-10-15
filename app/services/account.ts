import axios from 'axios';

const url = `${process.env.LOCAL_URL}/account`;
export async function getAccountInfo(accountId: string) {
  return axios.get(`${url}/${accountId}`)
    .then(res => res.data);
}