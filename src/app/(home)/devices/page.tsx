import { ScreenShare } from 'lucide-react';
import Link from 'next/link';
import DevicesList from './components/devices-list';
import { getUserDevices } from '@/services/UserDevicesService';

async function DevicesPage() {
  const userDevices = await getUserDevices();

  return (
    <div className='p-4'>
      <header className='flex justify-between items-center gap-2'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          Your Devices
        </h1>
        <ScreenShare />
      </header>
      <p className='text-sm text-muted-foreground max-w-2xl my-2'>
        If you have an e-reader with{' '}
        <Link
          className='text-primary underline'
          href='https://koreader.rocks/'
          target='_blank'
        >
          Koreader
        </Link>{' '}
        you can install our{' '}
        <Link
          className='text-primary underline'
          href={'https://github.com/AgustinGalante19/readit.koplugin'}
          target='_blank'
        >
          plugin
        </Link>{' '}
        to sync your reading activity with Read-It!
      </p>
      <DevicesList devices={userDevices.data || []} />
    </div>
  );
}

export default DevicesPage;
