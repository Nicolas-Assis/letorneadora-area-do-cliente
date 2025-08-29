import { z } from 'zod';

export const envSchema = z.object({
  // Server
  PORT: z.string().default('8080').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ALLOWED_ORIGINS: z.string().optional(),

  // JWT
  // JWT_SECRET: z.string().min(32),

  // Database
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string().default('5432').transform(Number),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_SCHEMA: z.string().default('public'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Storage
  SUPABASE_STORAGE_BUCKET: z.string().default('products'),
  MAX_IMAGE_MB: z.string().default('5').transform(Number),
  ALLOWED_IMAGE_MIME: z.string().default('image/jpeg,image/png,image/webp'),

  // Swagger
  SWAGGER_TITLE: z.string().default('Le Torneadora API'),
  SWAGGER_DESCRIPTION: z.string().default('API robusta para o portal do cliente'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>) => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return result.data;
};
