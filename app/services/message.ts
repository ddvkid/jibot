import { subscribe } from './subscription';
import { lookup } from "./lookup";

export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = async (body) => {
  console.log(body);
  const args = body.message.text.split(' ');
  if (body.space.type !== 'DM') args.shift();
  const [ action, type, value ] = args;
  switch (action && action.toLocaleString()) {
    case 'subscribe':
      return await subscribe(body, type, value);
    case 'lookup':
      return await lookup(body, type, value);
    case 'surprise?':
      return {
        "cards": [
          {
            "sections": [
              {
                "widgets": [
                  {
                    "image": { "imageUrl": "https://andrews-jibot-images.s3.amazonaws.com/2059171460.jpg" }
                  },
                ]
              },
              {
                "widgets": [
                  {
                    "textParagraph":{
                      "text": JSON.stringify(body.message),
                    }

                  }
                ]
              },
            ]
          }
        ]
      };
    case 'help':
    case '':
      return {
        text: "*Commands:*\n  - lookup\n - subscribe\n - unsubscribe\n *Types:*\n - jira\n - account\n - campaign\n For example: lookup jira *ticket-num*"
      };
    default:
      return {
        text: "Sorry this feature is not available on a free account, join us now with only $99/day!!!"
      }
  }
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
};
