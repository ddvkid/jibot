import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";

export const subscribe = async (type: string, payload: any) => {
  console.log(payload);

  // Create the DynamoDB service object

  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: v4(),
      type: type,
      thread: payload.message.thread.name,
      user: payload.message.sender
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
