import nextEnv from '@next/env';
// Apply the same file precedence as Next for checks that run before build.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV === 'development');
