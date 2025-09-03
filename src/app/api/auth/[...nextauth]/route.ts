import { turso } from '@/services/database/turso';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      try {
        const { name, email } = user;
        if (!name || !email) return false;

        const userExists = await turso.execute({
          sql: `SELECT email FROM readit_users where email = ?;`,
          args: [email],
        });

        if (userExists.rows.length > 0) {
          return true;
        }
        await turso.execute({
          sql: `INSERT INTO readit_users (name, email) values(?, ?);`,
          args: [name, email],
        });
        return true;
      } catch {
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
