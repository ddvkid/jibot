import { getTicketDetails } from "./jira/jira";

export const lookup = async(body, type, value) => {

  if (new RegExp('([a-zA-Z]{2,4}-\\d+)', 'g').test(value)) {
    return {
      text: 'Invalid ticket number!',
    };
  }
  console.log(value);
  const ticketDetails = await getTicketDetails(value);
  console.log(ticketDetails);
  return {
    text: JSON.stringify(ticketDetails),
  };
}