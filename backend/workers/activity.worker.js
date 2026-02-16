
import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ActivityLog from '../models/ActivityLog.js';

dotenv.config();

const redisConfig = {
    url: process.env.REDIS_URL,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Worker connected to MongoDB'))
    .catch(err => console.error('Worker MongoDB Connection Error:', err));

const worker = new Worker('activity-log', async job => {
    // useful debug log for dev
    console.log(`Processing job ${job.name} for ${job.data.entityType} ${job.data.entityId}`);
    
    try {
        const { workspaceId, userId, action, entityType, entityId, metadata } = job.data;

        await ActivityLog.create({
            workspace: workspaceId,
            user: userId,
            action,
            entityType,
            entityId,
            metadata,
            timestamp: new Date()
        });

        console.log(`Logged action: ${action}`);
    } catch (error) {
        console.error(`Job Failed: ${error.message}`);
        // let bullmq handle retries
        throw error;
    }
}, {
    connection: redisConfig,
    concurrency: 5 // tuned concurrency for optimal load
});

worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
});

console.log("Activity Worker Started...");

// Graceful Shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing worker');
    await worker.close();
    process.exit(0);
});
