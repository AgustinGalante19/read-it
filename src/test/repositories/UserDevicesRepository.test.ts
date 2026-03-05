import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userDevicesRepository } from '@/services/repositories/UserDevicesRepository';
import { createTestDatabase } from '@/test/db/setupTestDb';

let testDb: ReturnType<typeof createTestDatabase>;

vi.mock('@/services/database/kysely', () => {
  return {
    db: {
      selectFrom: (...args: any[]) => (globalThis as any).__kysely.selectFrom(...args),
      insertInto: (...args: any[]) => (globalThis as any).__kysely.insertInto(...args),
      deleteFrom: (...args: any[]) => (globalThis as any).__kysely.deleteFrom(...args),
    },
  };
});

describe('UserDevicesRepository (integration)', () => {
  beforeEach(async () => {
    testDb = createTestDatabase();
    (globalThis as any).__kysely = testDb.db;

    await testDb.db
      .insertInto('readit_users')
      .values({ email: 'user@test.com', name: 'User' })
      .execute();
  });

  afterEach(async () => {
    await testDb.db.destroy();
    testDb.sqlite.close();
  });

  it('adds and lists devices', async () => {
    await userDevicesRepository.addDevice('user@test.com', 'Kindle', 'dev1');
    const devices = await userDevicesRepository.getDevicesByUserEmail(
      'user@test.com',
    );

    expect(devices).toHaveLength(1);
    expect(devices[0].device_code).toBe('dev1');
  });

  it('checks device ownership', async () => {
    await testDb.db
      .insertInto('readit_user_devices')
      .values({
        id: 1,
        user_email: 'user@test.com',
        device_code: 'dev1',
        device_name: 'Kindle',
      })
      .execute();

    const isOwner = await userDevicesRepository.checkDeviceOwnership(
      1,
      'user@test.com',
    );
    const notOwner = await userDevicesRepository.checkDeviceOwnership(
      1,
      'other@test.com',
    );

    expect(isOwner).toBe(true);
    expect(notOwner).toBe(false);
  });

  it('deletes device and related page stats', async () => {
    await testDb.db
      .insertInto('readit_user_devices')
      .values({
        id: 1,
        user_email: 'user@test.com',
        device_code: 'dev1',
        device_name: 'Kindle',
      })
      .execute();

    await testDb.db
      .insertInto('readit_page_stat_data')
      .values({
        hash: 'hash',
        page: 1,
        start_time: 100,
        duration: 10,
        total_pages: 10,
        user_device_code: 'dev1',
      })
      .execute();

    await userDevicesRepository.deleteDevice(1);

    const devices = await userDevicesRepository.getDevicesByUserEmail(
      'user@test.com',
    );
    expect(devices).toHaveLength(0);

    const stats = await testDb.db
      .selectFrom('readit_page_stat_data')
      .selectAll()
      .execute();
    expect(stats).toHaveLength(0);
  });
});
