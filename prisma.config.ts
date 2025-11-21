import { defineConfig } from 'prisma/config';
import { ConfigService } from '@nestjs/config';

import { env } from 'process';

import * as dotenv from 'dotenv';

dotenv.config();
const configService = new ConfigService();

const databaseUrl: string =
  configService.get<string>('DATABASE_URL') || env.DATABASE_URL || '';

if (!databaseUrl || databaseUrl === '')
  throw new Error('DATABASE_URL not found in environment');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: databaseUrl,
  },
});
