import axios from "axios";
import { config } from 'dotenv';
config();
const url = 'https://platform.stage.rokt.com';
const AccountMap = new Map();
export const getChangedAccountIds = async (accountIds: string[]) => {
  const accountChanges = await Promise.all(accountIds.map(getLastChange));
  let changes = {};
  accountChanges.forEach(last => {
      const lastUpdateTime = AccountMap.get(last.accountId);
      if (lastUpdateTime) {
        if (lastUpdateTime !== last.dateCreatedUtc) {
          changes[last.accountId] = last;
          AccountMap.set(last.accountId, last.dateCreatedUtc);
        }
      } else {
        AccountMap.set(last.accountId, last.dateCreatedUtc);
      }
  });
  return changes;
}


const getLastChange = async (accountId) => {
  return axios.get(`${url}/api/accounts/${accountId}/activities?accountId=${accountId}&timezoneId=89`, {headers: {'Authorization': `Bearer ${process.env.JWT}`}})
    .then(res => res.data.items[0])
    .catch(console.log)
}
