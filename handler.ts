import { Handler } from 'aws-lambda';

export const hello: Handler = (event: any) => {
  let response;
  if (event.httpMethod === 'GET' || !event.body.message) {
    response = 'Hello! This function is meant to be used in a Hangouts Chat Room.';
  } else {
    const sender = event.body.message.sender.displayName;
    const image = event.body.message.sender.avatarUrl;

    response = {
      statusCode: 200,
      body: JSON.stringify(
        {
          sender,
          image,
          input: event,
        },
        null,
        2
      ),
    };
  }

  return new Promise((resolve) => {
    resolve(response)
  })
}