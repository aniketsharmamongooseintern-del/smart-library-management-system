import { registerAs } from '@nestjs/config';

export const otpConfigFactory = registerAs('otp', () => ({
  default: '000000',
  length: 6,
  maxAttempt: 10,
  maxRetries: 5,
  timeout: 300000, // 5 min for library project
  blockTimeout: 86400000 // 24 hr
}));
