import UserDevices from '@/types/UserDevices';
import { db } from '../database/kysely';

class UserDevicesRepository {
  async getDevicesByUserEmail(user_email: string): Promise<UserDevices[]> {
    const result = await db
      .selectFrom('readit_user_devices')
      .selectAll()
      .where('user_email', '=', user_email)
      .execute();

    return result.map(
      ({ id, user_email, device_name, device_code, created_at }) => {
        return {
          id: Number(id),
          user_email: String(user_email),
          device_name: String(device_name),
          device_code: String(device_code),
          created_at: String(created_at),
        };
      },
    );
  }

  async addDevice(
    user_email: string,
    device_name: string,
    device_code: string,
  ): Promise<{ device_name: string; device_code: string }> {
    await db
      .insertInto('readit_user_devices')
      .values({
        user_email,
        device_name,
        device_code,
      })
      .execute();

    return { device_name, device_code };
  }

  async deleteDevice(deviceId: number): Promise<void> {
    await db
      .deleteFrom('readit_page_stat_data')
      .where(
        'user_device_code',
        '=',
        db
          .selectFrom('readit_user_devices')
          .select('device_code')
          .where('id', '=', deviceId),
      )
      .execute();

    await db
      .deleteFrom('readit_user_devices')
      .where('id', '=', deviceId)
      .execute();
  }
}

export const userDevicesRepository = new UserDevicesRepository();
