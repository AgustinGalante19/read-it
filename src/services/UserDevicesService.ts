'use server';

import { getUserEmail } from './UserService';
import UserDevices from '@/types/UserDevices';
import { Result } from '@/types/Result';
import { userDevicesRepository } from './repositories/UserDevicesRepository';
import { revalidatePath } from 'next/cache';

export async function getUserDevices(): Promise<Result<UserDevices[]>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }
    const devices =
      await userDevicesRepository.getDevicesByUserEmail(userEmail);
    return { success: true, data: devices };
  } catch {
    return { success: false, error: 'Failed to fetch user devices' };
  }
}

export async function addUserDevice(
  deviceName: string,
  deviceCode: string,
): Promise<Result<{ device_name: string; device_code: string }>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }
    const newDevice = await userDevicesRepository.addDevice(
      userEmail,
      deviceName,
      deviceCode,
    );
    revalidatePath('/devices');
    return { success: true, data: newDevice };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to add user device' };
  }
}

export async function deleteUserDevice(
  deviceId: number,
): Promise<Result<string>> {
  try {
    const isValid = await userDevicesRepository.checkDeviceOwnership(
      deviceId,
      await getUserEmail(),
    );
    if (!isValid) {
      return { success: false, error: 'Device does not belong to user' };
    }
    await userDevicesRepository.deleteDevice(deviceId);
    revalidatePath('/devices');
    return { success: true, data: 'Device deleted successfully' };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to delete user device' };
  }
}
