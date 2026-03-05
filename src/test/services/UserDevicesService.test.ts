import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/UserService', () => ({
  getUserEmail: vi.fn(),
}));

vi.mock('@/services/repositories/UserDevicesRepository', () => ({
  userDevicesRepository: {
    getDevicesByUserEmail: vi.fn(),
    addDevice: vi.fn(),
    deleteDevice: vi.fn(),
    checkDeviceOwnership: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import {
  getUserDevices,
  addUserDevice,
  deleteUserDevice,
} from '@/services/UserDevicesService';
import { getUserEmail } from '@/services/UserService';
import { userDevicesRepository } from '@/services/repositories/UserDevicesRepository';
import { revalidatePath } from 'next/cache';

const mockedGetUserEmail = vi.mocked(getUserEmail);
const mockedRepo = vi.mocked(userDevicesRepository);
const mockedRevalidate = vi.mocked(revalidatePath);

describe('UserDevicesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns auth error when user missing', async () => {
    mockedGetUserEmail.mockResolvedValue('' as any);
    const result = await getUserDevices();

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');
  });

  it('adds device and revalidates path', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedRepo.addDevice.mockResolvedValue({
      device_name: 'Kindle',
      device_code: 'abc',
    });

    const result = await addUserDevice('Kindle', 'abc');
    expect(result.success).toBe(true);
    expect(mockedRevalidate).toHaveBeenCalledWith('/devices');
  });

  it('prevents deleting device not owned by user', async () => {
    mockedRepo.checkDeviceOwnership.mockResolvedValue(false);
    mockedGetUserEmail.mockResolvedValue('user@test.com');

    const result = await deleteUserDevice(1);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Device does not belong to user');
  });

  it('deletes device and revalidates path', async () => {
    mockedRepo.checkDeviceOwnership.mockResolvedValue(true);
    mockedGetUserEmail.mockResolvedValue('user@test.com');

    const result = await deleteUserDevice(1);
    expect(result.success).toBe(true);
    expect(mockedRepo.deleteDevice).toHaveBeenCalledWith(1);
    expect(mockedRevalidate).toHaveBeenCalledWith('/devices');
  });
});
