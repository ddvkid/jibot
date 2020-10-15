import { Handler } from 'aws-lambda';
import { handleCardClick, handleMessage } from './services/message';
import { DynamoDB } from 'aws-sdk';

export const bot: Handler = async (event: any) => {
  let response;
  if (event.httpMethod === 'GET' || !event.body) {
    response = {
      statusCode: 200,
      body: 'waaaaat?'
    };
  } else {
    const payload = JSON.parse(event.body);
    let value;
    switch (payload.type) {
      case 'ADDED_TO_SPACE':
        value = {
          text: 'Hello! I’m Rokbot. I can help you to subscribe changes to jira tickets or accounts. Type ‘help’ to find out more.'
        }
        break;
      case 'REMOVED_FROM_SPACE':
        value = {
          text: 'You will regret letting me go!!!'
        }
        break;
      case 'MESSAGE':
        value = await handleMessage(payload);
        break;
      case 'CARD_CLICKED':
        value = handleCardClick(payload);
        break;
    }
    response = {
      statusCode: 200,
      body: JSON.stringify(value),
    };
  }
  console.log(response);

  return response;
};

export const lookup: Handler = (event: any) => {
  const dynamoDb = new DynamoDB();
  const params = {
    TableName: 'activities',
  };
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return {
        statusCode: 500,
        body: JSON.stringify(err.stack),
      };
    } else {
      console.log(data);
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }
  });
};
