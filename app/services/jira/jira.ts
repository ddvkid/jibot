import axios from 'axios';
const OP_ATLASSIAN_API_USER='andrew.yang@rokt.com'
const OP_ATLASSIAN_API_TOKEN='XnvYyVPtzl1VdHCkoGBx894C'

const jiraAxios = axios.create({
  baseURL: 'https://rokton.atlassian.net/rest/api/2',
  auth: {
    username: OP_ATLASSIAN_API_USER,
    password: OP_ATLASSIAN_API_TOKEN,
  },
  headers: {
    Accept: 'application/json',
    ContentType: 'application/json'
  },
})

export async function getTicketDetails(ticketId: string) {
  return jiraAxios.get(`/issue/${ticketId}`)
    .then(response => ({
      ...response,
      data: {
        isFound: true,
        ...response?.data
      }
    }))
    .catch((error) => {
      // Just simply return the data with isFound:false when error happens.
      console.log(error.toJSON());
      return {
        data: {
          isFound: false,
          key: ticketId,
        }
      };
    });
}



