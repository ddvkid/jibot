import { Handler } from 'aws-lambda';

export const hello: Handler = async (event: any) => {
  console.log(event)
  let response;
  if (event.httpMethod === 'GET' || !event.body) {
    response = {
      statusCode: 200,
      body: 'Hello! This function is meant to be used in a Hangouts Chat Room.'
    };
  } else {
    const payload = JSON.parse(event.body)
    const sender = payload.message.sender.displayName;
    const image = payload.message.sender.avatarUrl;
    const text = `${sender} slap Andrew's face, Ouch!!!`
    response = {
      statusCode: 200,
      body: JSON.stringify(
        {
          text: text
        }
      ),
    };
  }
  console.log(response);

  return response;
}