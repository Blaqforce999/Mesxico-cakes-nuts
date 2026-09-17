import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://mock-project.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default('mock-anon-key-for-local-preview'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('mock-service-role-key-for-local-preview'),
  FLUTTERWAVE_PUBLIC_KEY: z.string().min(1).default('FLWPUBK_TEST-mock-key'),
  FLUTTERWAVE_SECRET_KEY: z.string().min(1).default('FLWSECK_TEST-mock-key'),
  FLUTTERWAVE_SECRET_HASH: z.string().min(1).default('mesxico_webhook_secret_hash_test'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
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
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key',
      FLUTTERWAVE_PUBLIC_KEY: process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-mock',
      FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-mock',
      FLUTTERWAVE_SECRET_HASH: process.env.FLUTTERWAVE_SECRET_HASH || 'mesxico_webhook_hash',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };
