// src/scripts/scheduler.ts

import cron from 'node-cron';
import { exec } from 'child_process';

const runFetchScript = () => {
  console.log('⏰ Running fetchLiveStockData.ts...');
  exec('npx ts-node src/scripts/fetchLiveStockData.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`❌ Script error: ${stderr}`);
      return;
    }
    console.log(`✅ Script output:\n${stdout}`);
  });
};

// Schedule the script to run every hour during market hours (9:30 AM to 4 PM EST)
cron.schedule('0 13-20 * * 1-5', runFetchScript, {
  timezone: 'America/New_York',
});
