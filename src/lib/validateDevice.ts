import { turso } from '@/services/database/turso';

export async function validateDeviceCode(
  deviceCode: string | undefined | null
): Promise<{ valid: boolean; error?: string }> {
  if (!deviceCode) {
    return { valid: false, error: 'Device code is required' };
  }

  try {
    const { rows } = await turso.execute({
      sql: 'SELECT 1 FROM readit_user_devices WHERE device_code = ?',
      args: [deviceCode],
    });

    if (rows.length === 0) {
      return { valid: false, error: 'Invalid device code' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating device code:', error);
    return { valid: false, error: 'Error validating device' };
  }
}
