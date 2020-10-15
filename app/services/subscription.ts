import { DynamoDB } from "aws-sdk";
import { lookup } from "./lookup";

export const subscribe = async (payload: any = {message: {}}, type: string, value: string) => {
  const msg = await lookup(payload, type, value, true);
  if (msg.text && msg.text.includes('invalid')) {
    return msg;
  }
  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: payload.message.thread.name+type+value,
      type,
      value,
      user: payload.message.sender.displayName,
      chat_info: payload
    },
  };

  // Call DynamoDB to add the item to the table
  try {
    const ddb = new DynamoDB.DocumentClient();

    await ddb.put(params).promise();
  } catch (e) {
    console.error(e);
  }

  return msg;
};

export const unsubscribe = async (payload: any = {message: {}}, type: string, value: string) => {
  var docClient = new DynamoDB.DocumentClient();
  
  const params = {
    TableName: "jibot-subscription",
    IndexName: "value-index",
    KeyConditionExpression: "#jibot_value = :hkey",
    ExpressionAttributeValues: {
      ":hkey": value,
    },
    ExpressionAttributeNames: {
      "#jibot_value": "value"
    }
  };
  try {
    
    const data = await queryDynamo(params);
    for (const sub of data.Items) {
      if (payload.message.sender.name === sub.chat_info.message.sender.name) {
        await docClient.delete({
          TableName: "jibot-subscription",
          Key:{
              "id": sub.id
          }
        }).promise();
      }
    }
    
    return {
      text: `Unsubscribed ${payload.message.sender.displayName} for ${type} ${value}`
    }
  }catch(err) {
    console.error(err)
    return {
      text: "Failed to unsubscribe"
    }
  }
}

async function queryDynamo(params: DynamoDB.DocumentClient.QueryInput) {
  const dynamoDb = new DynamoDB.DocumentClient();
  try {
    const data = await dynamoDb.query(params).promise();
    return data;
  } catch (err) {
    console.log(err, err.stack);
    return null;
  }
}