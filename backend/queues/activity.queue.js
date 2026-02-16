import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

let activityQueue = null;

if (process.env.REDIS_URL) {
    activityQueue = new Queue('activity-log', {
        connection: {
            url: process.env.REDIS_URL
        },
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true, // Keep Redis clean
            removeOnFail: 100 // Keep last 100 failed jobs for debugging
        }
    });

    activityQueue.on('error', (err) => {
        console.error('❌ Activity Queue Error:', err);
    });

    console.log("✅ Activity Queue initialized");
} else {
    console.warn("⚠️ REDIS_URL missing. Background jobs disabled.");
    // Mock queue interface to prevent crashes
    activityQueue = {
        add: async () => { console.warn("Job ignored (No Redis)"); }
    };
}

export default activityQueue;
