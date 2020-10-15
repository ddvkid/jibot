import * as cron from 'cron'
import { runTask } from "./jira-job";

const job = new cron.CronJob('*/10 * * * * *', async function () {
    console.log('*** CronJob is running ***')
    // TODO get all subscribed tickets from
    await runTask();
});

job.start();
