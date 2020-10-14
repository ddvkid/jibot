import { DynamoDB } from "aws-sdk";

export const subscribe = async (type: string, payload: any, value: string) => {
  console.log(payload);

  // Create the DynamoDB service object

  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: payload.message.thread.name,
      type,
      user: payload.message.sender,
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
