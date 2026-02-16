import rateLimit from "express-rate-limit";

// Helper for structured error response
const limitReachedResponse = (req, res, options) => {
    res.status(429).json({
        success: false,
        statusCode: 429,
        message: options.message || "Too many requests, please try again later."
    });
};

// A. Global Limiter (500 requests per 15 minutes)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: limitReachedResponse,
    message: "Too many requests from this IP, please try again after 15 minutes",
    validate: { trustProxy: false } // We will set trust proxy in index.js explicitly
});

// B. Auth Limiter (Strict: 10 attempts per 15 minutes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limitReachedResponse,
    message: "Too many login/signup attempts, please try again after 15 minutes"
});

// C. Chat Spam Limiter (100 messages per 10 minutes)
export const chatLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limitReachedResponse,
    message: "You are sending messages too fast. Please slow down."
});
