import axios from 'axios';
import {sendMessage} from "../google-chat";
const OP_ATLASSIAN_API_USER='andrew.yang@rokt.com'
const OP_ATLASSIAN_API_TOKEN='XnvYyVPtzl1VdHCkoGBx894C'

interface ThreadTickets {
    threadId: string,
    ticketIds: Set<string>,
}

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

export async function getChangedTicketIds(allTicketIds: string[]):Promise<string[]> {
    const results = await isTicketsStatusChanged(allTicketIds);
    return allTicketIds
        .filter((ticketId, index) => results[index])
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

// TODO Baron: please help to implement this function to query all subscribed ticketIds from DB
export async function getSubscribedTicketIds() {
    // AWS.config.update({region: 'us-east-1'});
    // const dynamoDb = new AWS.DynamoDB();
    // const params = {
    //   TableName: "jibot-subscription"
    // }
    // dynamoDb.scan(params, (err, data) => {
    //   if (err) {
    //     console.log(err, err.stack);
    //     return {
    //       statusCode: 500,
    //       body: JSON.stringify(err.stack),
    //     };
    //   } else {
    //     console.log(data);
    //     return {
    //       statusCode: 200,
    //       body: JSON.stringify(data),
    //     };
    //   }
    // });
    return ['OPC-1432', 'OPC-1452'];
}

export async function getChatThreadTickets(ticketIds: string[]): Promise<Array<ThreadTickets>> {
    // TODO Baron getting all chat thread IDs by ticketsIds from DB

    return [{
        threadId: 'spaces/8yl_8QAAAAE',
        ticketIds: new Set(['OPC-1432']),
    }];
}

export function generateMessage(ticketIds: Set<string>) {
    return `The following tickets are changed: 
    ${Array.from(ticketIds).reduce((text: string, ticketId: string) => {
        return `${text} 
        ${ticketId} -> ${getTicketLatestStatus(ticketId)}
        `
    }, '')}
    `
}

export async function runTask() {
    const subscribedTicketIds = await getSubscribedTicketIds();
    const changedTicketIds = await getChangedTicketIds(subscribedTicketIds);
    const threadTickets = await getChatThreadTickets(changedTicketIds);
    await Promise.all(threadTickets.map(threadTicket => sendMessage(threadTicket.threadId, generateMessage(threadTicket.ticketIds))))
}






