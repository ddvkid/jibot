import { subscribe } from './subscription';
import { getTicketDetails, parseJiraTickets } from './jira/jira';

export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = async (body) => {
  const [ _, action, type, value, ...params ] = body.message.text.split(' ');
  if (action && action.toLowerCase() === 'subscribe') {
    return await subscribe(body, type, value);
  }
  if (action && action.toLowerCase() === 'getjiraticket') {
    const tickets = parseJiraTickets(body?.message?.text);

    if (!tickets || tickets.length === 0) {
      return {
        text: 'No ticket entered',
      };
    }

    const ticketDetails = await Promise.all(tickets.map(ticketId => getTicketDetails(ticketId)));

    return {
      text: JSON.stringify(ticketDetails.filter((ticket: any) => ticket.isFound)),
    };
  }
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
  }
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
}