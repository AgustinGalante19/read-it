import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
