import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all env vars from .env files.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // In Vercel, env vars are in process.env. We prefer those, falling back to loaded .env file.
  const processEnv = process.env || {};

  return {
    plugins: [react()],
    define: {
      // Replace process.env.KEY in the code with the actual string value during build
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(processEnv.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      'process.env.API_KEY': JSON.stringify(processEnv.API_KEY || env.API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});