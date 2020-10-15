import axios from "axios";
import { sendMessage } from "../google-chat";
import AWS, { DynamoDB } from "aws-sdk";
import { getChangedAccountIds } from "./account";
const OP_ATLASSIAN_API_USER = "andrew.yang@rokt.com";
const OP_ATLASSIAN_API_TOKEN = "XnvYyVPtzl1VdHCkoGBx894C";

interface ThreadTickets {
  threadId: string;
  user: string;
  ticketIds: Set<string>;
}

const TicketStatusMap: Map<string, any> = new Map();

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

export async function getChangedTicketIds(
  allTicketIds: Set<string>
): Promise<string[]> {
  const results = await isTicketsStatusChanged(allTicketIds);
  return Array.from(allTicketIds).filter((ticketId, index) => results[index]);
}

export async function isTicketStatusChanged(ticketId: string) {
  const oldStatus = TicketStatusMap.get(ticketId) && TicketStatusMap.get(ticketId).newStatus;
  const newStatus = await getTicketStatus(ticketId);
  if (oldStatus === undefined) {
    TicketStatusMap.set(ticketId, { newStatus });
    return false;
  }
  return newStatus !== oldStatus
    ? !!TicketStatusMap.set(ticketId, { oldStatus, newStatus })
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

export async function getSubscribedIds(type: string) {
  const params = {
    TableName: "jibot-subscription",
    IndexName: "type-index",
    KeyConditionExpression: "#jibot_type = :hkey",
    ExpressionAttributeValues: {
      ":hkey": type,
    },
    ExpressionAttributeNames: {
      "#jibot_type": "type"
    }
  };

  const data = await queryDynamo(params);
  return data?.Items;
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
      const threadId = x.chat_info.threadKey || x.chat_info.message.thread.name;;
      if (!resultDic.hasOwnProperty(threadId)){
        resultDic[threadId] = {
          space: x.chat_info.message.space.name,
          user: x.chat_info.user.name,
          ticketIds: new Set([ticketId])
        }
      } else {
        resultDic[threadId].ticketIds.add(ticketId)
      }
    })
  }

  return Object.keys(resultDic).map(x => ({
    threadId: x,
    ...resultDic[x]
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

export function generateMessage(ticketIds: Set<string>, user: string) {
  return `${Array.from(ticketIds).reduce((text: string, ticketId: string) => {
      return `${text}
        Hey <${user}>! ${ticketId} (https://rokton.atlassian.net/browse/${ticketId}) has been changed from *${TicketStatusMap.get(ticketId).oldStatus}* to *${TicketStatusMap.get(ticketId).newStatus}*
        `;
    }, "")}
    `;
}

export function createMessage(sub, changes) {
  return `Hey <${sub.chat_info.user.name}>! The account ${changes.accountName} you subscribed has been changed by ${changes.userName.fullName}! 
  ${JSON.stringify(changes)}`
}

export async function runTask() {
  const subscribedTicketIds = new Set((await getSubscribedIds('jira'))?.map(x => x.value) || []);
  console.log('subscribedTicketIds ', subscribedTicketIds);
  const changedTicketIds = await getChangedTicketIds(subscribedTicketIds);
  console.log('changedTicketIds ', changedTicketIds);
  const threadTickets = await getChatThreadTickets(changedTicketIds);
  console.log('threadTickets ', threadTickets);
  await Promise.all(
    threadTickets.map((threadTicket) =>
      sendMessage(
        threadTicket,
        generateMessage(threadTicket.ticketIds, threadTicket.user)
      )
    )
  );

  const subscribedAccountIds = await getSubscribedIds('account');
  const changedAccountIds = await getChangedAccountIds(Array.from(new Set(subscribedAccountIds.map(x => x.value))));
  console.log(changedAccountIds);
  await Promise.all(
    subscribedAccountIds
      .filter(sub => Object.keys(changedAccountIds).includes(sub.value))
      .map((sub) =>
        sendMessage(
          {space: sub.chat_info.message.space.name, threadId: sub.chat_info.threadKey},
           createMessage(sub, changedAccountIds[sub.value])
        )
    )
  );
}
