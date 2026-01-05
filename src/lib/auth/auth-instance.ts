// Reverting to original state for now to fix the lint error
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware } from 'better-auth/api';
import { checkIfUserExists, createUser } from '@/services/UserService';
import { db } from './auth-db';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      accessType: 'offline',
      prompt: 'select_account consent',
    },
  },
  plugins: [nextCookies()],
  database: {
    db: db,
    type: 'sqlite',
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/callback/') && ctx.context.newSession) {
        const user = ctx.context.newSession.user;
        if (!user.name || !user.email) return false;

        const userExists = await checkIfUserExists(user.email);
        if (!userExists) {
          await createUser(user.name, user.email);
        }
      }
    }),
  },
});
