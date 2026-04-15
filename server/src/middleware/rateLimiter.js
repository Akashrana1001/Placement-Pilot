import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';

const createLimiter = (minutes, maxRequests, message) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    keyGenerator: (req) => {
      if (req.user?._id) return req.user._id.toString();
      const forwardedFor = req.headers['x-forwarded-for'];
      const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : req.ip;
      return ip || ipKeyGenerator(req);
    },
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
  });
};

export const generalLimiter = createLimiter(
  1, 100, 'Too many requests from this IP, please try again after a minute.'
);

export const authLimiter = createLimiter(
  1, 20, 'Too many login/register attempts, please try again after a minute.'
);

export const agentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Agent processing limit reached. Please wait.' },
  keyGenerator: (req) => {
    if (req.user?._id) return req.user._id.toString();
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : req.ip;
    return ip || ipKeyGenerator(req);
  },
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});