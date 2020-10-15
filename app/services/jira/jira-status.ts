import axios from 'axios';
const OP_ATLASSIAN_API_USER='andrew.yang@rokt.com'
const OP_ATLASSIAN_API_TOKEN='XnvYyVPtzl1VdHCkoGBx894C'

const TicketStatusMap: Map<string, string> = new Map();

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

export async function getTicketStatus(ticketId: string) {
    return getTicketDetails(ticketId, 'status')
        .then(({ data }) => {
            console.log(ticketId, data.fields.status.name);
            return data.fields.status.name;
        });
}

export async function isTicketsStatusChanged(ticketIds: string[]): Promise<boolean[]> {
    return Promise.all(ticketIds.map(isTicketStatusChanged));
}

export function getTicketLatestStatus(ticketId: string) {
    return TicketStatusMap.get(ticketId);
}

export async function isTicketStatusChanged(ticketId: string) {
    const oldStatus = TicketStatusMap.get(ticketId);
    const newStatus = await getTicketStatus(ticketId);
    if (oldStatus === undefined) {
        TicketStatusMap.set(ticketId, newStatus)
        return false;
    }
    return newStatus !== oldStatus ? !!TicketStatusMap.set(ticketId, newStatus) : false;
}

export async function getTicketDetails(ticketId: string, fields: string = '*all') {
    return jiraAxios.get(`/issue/${ticketId}`, {
            params: {
                fields,
            }
        })
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



