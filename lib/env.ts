import { z } from 'zod';

const envSchema = z.object({
  FLUTTERWAVE_PUBLIC_KEY: z.string().min(1).default('FLWPUBK_TEST-mock-key'),
  FLUTTERWAVE_SECRET_KEY: z.string().min(1).default('FLWSECK_TEST-mock-key'),
  FLUTTERWAVE_SECRET_HASH: z.string().min(1).default('mesxico_webhook_secret_hash_test'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse({
  FLUTTERWAVE_PUBLIC_KEY: process.env.FLUTTERWAVE_PUBLIC_KEY,
  FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY,
  FLUTTERWAVE_SECRET_HASH: process.env.FLUTTERWAVE_SECRET_HASH,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      FLUTTERWAVE_PUBLIC_KEY: process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-mock',
      FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-mock',
      FLUTTERWAVE_SECRET_HASH: process.env.FLUTTERWAVE_SECRET_HASH || 'mesxico_webhook_hash',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };
