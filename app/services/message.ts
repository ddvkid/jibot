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
    case 'help':
      return {
        text: "*Here are some things that I can do for you:*\n   Lookup ‘jira-ticket’.\n   Lookup campaign campaignId.\n   Lookup account accountId.\n   Subscribe jira jira-ticket.\n   Subscribe campaign campaignId.\n   Subscribe account accountId."
      };
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
    default:
      return {
        text: "*Sorry, I don’t think I got that. Here are a few things you can type right  now:*\n   Lookup ‘jira-ticket’.\n   Lookup campaign campaignId.\n   Lookup account accountId.\n   Subscribe jira jira-ticket.\n   Subscribe campaign campaignId.\n   Subscribe account accountId."
      };
  }
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
};
