import { DynamoDB } from "aws-sdk";

export const subscribe = async (type: string, payload: any, value: string) => {
  console.log(payload);

  // Create the DynamoDB service object
  const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: { S: payload.message.thread.name },
      type: { S: type },
      value: { S: value }
    },
  };

  // Call DynamoDB to add the item to the table
  try {
    await ddb.putItem(params).promise();
  } catch (e) {
    console.log(e);
  }

  return { text: "subscribed!!" };
};
