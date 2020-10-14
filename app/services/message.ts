import { subscribe } from './subscription';
import { getTicketDetails, parseJiraTickets } from './jira/jira';

export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = async (body) => {
  const [ _, action, type, name, ...params ] = body.message.text.split(' ');
  if (action && action.toLowerCase() === 'subscribe') {
    return await subscribe(type, body);
  }
  if (action.toLowerCase() === 'getjiraticket') {
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
    text: 'handleMessage ' + JSON.stringify(body.message)
  };
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
};