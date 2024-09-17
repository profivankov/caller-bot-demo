import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.development.env' });

execSync('npx tsx src/index.ts', { stdio: 'inherit' });
