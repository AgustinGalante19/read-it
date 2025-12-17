import UserDevices from '@/types/UserDevices';
import { turso } from '../database/turso';

class UserDevicesRepository {
  async getDevicesByUserEmail(user_email: string): Promise<UserDevices[]> {
    const result = await turso.execute({
      sql: `SELECT * FROM readit_user_devices WHERE user_email = ?`,
      args: [user_email],
    });
    return result.rows.map(
      ({ id, user_email, device_name, device_code, created_at }) => {
        return {
          id: Number(id),
          user_email: String(user_email),
          device_name: String(device_name),
          device_code: String(device_code),
          created_at: String(created_at),
        };
      }
    );
  }

  async addDevice(
    user_email: string,
    device_name: string,
    device_code: string
  ): Promise<{ device_name: string; device_code: string }> {
    await turso.execute({
      sql: `INSERT INTO readit_user_devices (user_email, device_name, device_code) VALUES (?, ?, ?)`,
      args: [user_email, device_name, device_code],
    });

    return { device_name, device_code };
  }
}

export const userDevicesRepository = new UserDevicesRepository();
