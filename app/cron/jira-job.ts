import axios from "axios";
import { sendMessage } from "../google-chat";
import AWS, { DynamoDB } from "aws-sdk";
const OP_ATLASSIAN_API_USER = "andrew.yang@rokt.com";
const OP_ATLASSIAN_API_TOKEN = "XnvYyVPtzl1VdHCkoGBx894C";

interface ThreadTickets {
  threadId: string;
  ticketIds: Set<string>;
}

const TicketStatusMap: Map<string, string> = new Map();

const jiraAxios = axios.create({
  baseURL: "https://rokton.atlassian.net/rest/api/2",
  auth: {
    username: OP_ATLASSIAN_API_USER,
    password: OP_ATLASSIAN_API_TOKEN,
  },
  headers: {
    Accept: "application/json",
    ContentType: "application/json",
  },
});

export async function getTicketStatus(ticketId: string) {
  return getTicketDetails(ticketId, "status").then(({ data }) => {
    console.log(ticketId, data.fields.status.name);
    return data.fields.status.name;
  });
}

export async function isTicketsStatusChanged(
  ticketIds: Set<string>
): Promise<boolean[]> {
  return Promise.all(Array.from(ticketIds).map(isTicketStatusChanged));
}

export function getTicketLatestStatus(ticketId: string) {
  return TicketStatusMap.get(ticketId);
}

export async function getChangedTicketIds(
  allTicketIds: Set<string>
): Promise<string[]> {
  const results = await isTicketsStatusChanged(allTicketIds);
  return Array.from(allTicketIds).filter((ticketId, index) => results[index]);
}

export async function isTicketStatusChanged(ticketId: string) {
  const oldStatus = TicketStatusMap.get(ticketId);
  const newStatus = await getTicketStatus(ticketId);
  if (oldStatus === undefined) {
    TicketStatusMap.set(ticketId, newStatus);
    return false;
  }
  return newStatus !== oldStatus
    ? !!TicketStatusMap.set(ticketId, newStatus)
    : false;
}

export async function getTicketDetails(
  ticketId: string,
  fields: string = "*all"
) {
  return jiraAxios
    .get(`/issue/${ticketId}`, {
      params: {
        fields,
      },
    })
    .then((response) => ({
      ...response,
      data: {
        isFound: true,
        ...response?.data,
      },
    }))
    .catch((error) => {
      // Just simply return the data with isFound:false when error happens.
      console.log(error.toJSON());
      return {
        data: {
          isFound: false,
          key: ticketId,
        },
      };
    });
}

export async function getSubscribedTicketIds() {
  const params = {
    TableName: "jibot-subscription",
    IndexName: "type-index",
    KeyConditionExpression: "#jibot_type = :hkey",
    ExpressionAttributeValues: {
      ":hkey": "jira",
    },
    ExpressionAttributeNames: {
      "#jibot_type": "type"
    }
  };

  const data = await queryDynamo(params);
  return new Set(data?.Items?.map(x => x.value) || []);
}

export async function getChatThreadTickets(
  ticketIds: string[]
): Promise<Array<ThreadTickets>> {

  const resultDic = {};
  for (let ticketId of ticketIds) {
    const params = {
      TableName: "jibot-subscription",
      IndexName: "value-index",
      KeyConditionExpression: "#jibot_value = :hkey",
      ExpressionAttributeValues: {
        ":hkey": ticketId,
      },
      ExpressionAttributeNames: {
        "#jibot_value": "value"
      }
    };
    const data = await queryDynamo(params);
    data.Items?.forEach(x => {
      const threadId = x.chat_info.message.thread.name;
      if(!resultDic.hasOwnProperty(threadId)){
        resultDic[threadId] = new Set([ticketId])
      }else{
        resultDic[threadId].add(ticketId)
      }
    })
  }

  return Object.keys(resultDic).map(x => ({
    threadId: x,
    ticketIds: resultDic[x]
  }))
}

async function queryDynamo(params: DynamoDB.DocumentClient.QueryInput) {
  AWS.config.update({region: 'us-east-1'});
  const dynamoDb = new DynamoDB.DocumentClient();
  try {
    const data = await dynamoDb.query(params).promise();
    return data;
  } catch (err) {
    console.log(err, err.stack);
    return null;
  }
}

export function generateMessage(ticketIds: Set<string>) {
  return `The following tickets are changed: 
    ${Array.from(ticketIds).reduce((text: string, ticketId: string) => {
      return `${text} 
        ${ticketId} -> ${getTicketLatestStatus(ticketId)}
        `;
    }, "")}
    `;
}

export async function runTask() {
  const subscribedTicketIds = await getSubscribedTicketIds();
  const changedTicketIds = await getChangedTicketIds(subscribedTicketIds);
  const threadTickets = await getChatThreadTickets(changedTicketIds);
  await Promise.all(
    threadTickets.map((threadTicket) =>
      sendMessage(
        threadTicket.threadId,
        generateMessage(threadTicket.ticketIds)
      )
    )
  );
}
