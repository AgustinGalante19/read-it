import { sql } from '@vercel/postgres';
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
        const { name, email, id: google_id } = user;

        const userExists =
          await sql`SELECT email from readit_users where email = ${email}`;

        if (userExists.rows.length > 0) {
          return true;
        }

        await sql`INSERT INTO readit_users (name, email, google_id) values(${name}, ${email}, ${google_id})`;

        return true;
      } catch {
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
