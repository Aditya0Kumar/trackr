import redisClient from "../config/redis.js";

/**
 * Enhanced Cache Helper with "Read-Through" strategy and Fallback protection.
 * 
 * @param {string} key - The Redis key to use (should be versioned, e.g., 'v1:...')
 * @param {number} ttl - Time to Live in seconds
 * @param {Function} fetchCallback - Async function to fetch data from DB if cache miss
 * @returns {Promise<any>} - The data (from cache or DB)
 */
export const getOrSetCache = async (key, ttl, fetchCallback) => {
    // Return early if Redis unavailable
    if (!redisClient || !redisClient.isOpen) {
        // console.warn(`Redis unavailable. Skipping cache for key: ${key}`);
        return await fetchCallback();
    }

    try {
        // Try to get from Cache
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            try {
                // Safe JSON Formatting
                return JSON.parse(cachedData);
            } catch (parseError) {
                console.error(`Cache JSON Parse Error for key ${key}:`, parseError);
                // Corrupted cache? Delete it and proceed to fetch fresh
                await redisClient.del(key);
            }
        }

        // Cache Miss (or corruption): Fetch from DB
        const freshData = await fetchCallback();

        // Store in Cache (only if data is valid)
        if (freshData !== undefined && freshData !== null) {
             // Use SET with EX (expiration)
            await redisClient.set(key, JSON.stringify(freshData), { EX: ttl });
        }

        return freshData;

    } catch (redisError) {
        console.error(`Redis Operation Error for key ${key}:`, redisError);
        // Failover: Just return fresh data from DB
        return await fetchCallback();
    }
};
