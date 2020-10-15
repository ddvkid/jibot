import axios from 'axios';

const url = `${process.env.LOCAL_URL || 'https://4d31da0a29a6.ngrok.io'}`;
export async function getProxyData(type: 'account' | 'campaign', id: string) {
  return axios.get(`${url}/${type}/${id}`)
    .then(res => res.data);
}