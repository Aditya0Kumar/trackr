import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

const initRedis = async () => {
    if (!process.env.REDIS_URL) {
        console.warn("⚠️ REDIS_URL not found. Caching disabled.");
        return;
    }

    redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    console.error("❌ Redis max retries reached. Stopping reconnection attempts.");
                    return new Error("Redis max retries reached");
                }
                return Math.min(retries * 100, 3000); // Exponential backoff capped at 3s
            }
        }
    });

    redisClient.on('error', (err) => {
        console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
        console.log('✅ Redis Client Connected');
    });

    try {
        await redisClient.connect();
    } catch (err) {
        console.error("❌ Failed to connect to Redis:", err);
        redisClient = null; // Ensure client is null so fallbacks work
    }
};

// Initialize immediately but don't block
initRedis();

export default redisClient;
