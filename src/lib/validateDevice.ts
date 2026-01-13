import { db } from '@/services/database/kysely';

export async function validateDeviceCode(
  deviceCode: string | undefined | null
): Promise<{ valid: boolean; error?: string }> {
  if (!deviceCode) {
    return { valid: false, error: 'Device code is required' };
  }

  try {
    await db
      .selectFrom('readit_user_devices')
      .select('id')
      .where('device_code', '=', deviceCode)
      .executeTakeFirstOrThrow();

    return { valid: true };
  } catch (error) {
    console.error('Error validating device code:', error);
    return { valid: false, error: 'Error validating device' };
  }
}
