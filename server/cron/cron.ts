import * as cron from 'cron'
import { runTask } from "./jira-job";

const job = new cron.CronJob('*/10 * * * * *', async function () {
    console.log('*** CronJob is running ***')
    await runTask();
});

job.start();
