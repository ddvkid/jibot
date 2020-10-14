import { DynamoDB } from "aws-sdk";

export const subscribe = async (payload: any = {message: {}}, type: string, value: string) => {
  console.log(payload);

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

  return { text: "subscribed!!" };
};
