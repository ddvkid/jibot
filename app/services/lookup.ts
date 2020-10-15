import { getTicketDetails } from "./jira";
import { getAccountInfo } from "./account";

export const lookup = async (body, type, value) => {
  switch (type.toLowerCase()) {
    case 'jira':
      return await handleJira(value);
    case 'account':
      return await handleAccount(value);
  }
}

const handleJira = async (ticketNumber) => {
  if (!new RegExp('([a-zA-Z]{2,4}-\\d+)', 'g').test(ticketNumber)) {
    return {
      text: 'Invalid ticket number!',
    };
  }
  console.log(ticketNumber);
  const ticketDetails = await getTicketDetails(ticketNumber);
  console.log(ticketDetails.data.fields.status, ticketDetails.data.summary);
  return { text: JSON.stringify(ticketDetails.data.fields.status) };
}

const handleAccount = async (accountId) => {
  const accountInfo = await getAccountInfo(accountId);
  console.log(accountInfo);
  return { text: accountInfo.data.name };
}