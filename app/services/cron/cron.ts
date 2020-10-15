import * as cron from 'cron'
import { isTicketsStatusChanged } from "./jira-job";

const job = new cron.CronJob('*/10 * * * * *', async function () {
    console.log('*** CronJob is running ***')
    // TODO get all subscribed tickets
    const example_tickets = ['OPC-1432', 'OPC-1452'];
    const results = await isTicketsStatusChanged(example_tickets);
    console.log('Status changes: ', results);
});

job.start();
