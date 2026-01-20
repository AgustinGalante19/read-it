import { db } from '../database/kysely';

class UserRepository {
  async checkIfUserExists(email: string) {
    const userData = await db
      .selectFrom('readit_users')
      .select('email')
      .where('email', '=', email)
      .execute();

    return userData.length > 0;
  }

  async createUser(name: string, email: string): Promise<void> {
    await db.insertInto('readit_users').values({ name, email }).execute();
  }
}

const userRepository = new UserRepository();

export default userRepository;
