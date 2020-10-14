import { DynamoDB } from "aws-sdk";

export const subscribe = async (type: string, payload: any, value: string) => {
  console.log(payload);

  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: payload.message && payload.message.thread.name || '123',
      type,
      user: payload.message && payload.message.sender,
      value
    },
  };

  // Call DynamoDB to add the item to the table
  try {
    const ddb = new DynamoDB.DocumentClient();

    await ddb.put(params).promise();
  } catch (e) {
    console.error(e);
  }

  return { text: "subscribed!!" };
};
