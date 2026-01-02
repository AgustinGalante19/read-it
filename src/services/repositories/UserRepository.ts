import { turso } from '../database/turso';

class UserRepository {
  async checkIfUserExists(email: string) {
    const userData = await turso.execute({
      sql: `SELECT * FROM readit_users WHERE email = ?`,
      args: [email],
    });

    return userData.rows.length > 0;
  }

  async createUser(name: string, email: string): Promise<void> {
    await turso.execute({
      sql: `INSERT INTO readit_users (name, email) VALUES (?, ?)`,
      args: [name, email],
    });
  }
}

const userRepository = new UserRepository();

export default userRepository;
