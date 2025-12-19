'use client';

import { Button } from '@/components/ui/button';
import UserDevices from '@/types/UserDevices';
import { Plus, TabletIcon, Trash2 } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { BookDeviceModal } from './book-device-modal';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { deleteUserDevice } from '@/services/UserDevicesService';
import { toast } from 'sonner';
import ConfirmationModal from './confirmation-modal';

function DevicesList({ devices }: { devices: UserDevices[] }) {
  const [isUserDeviceModalOpen, setIsUserDeviceModalOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(0);

  const handleDeleteDevice = async () => {
    try {
      setIsDeleteDialogOpen(false);
      const { success, data, error } = await deleteUserDevice(selectedDeviceId);
      if (success) toast.success(data || 'Device deleted successfully');
      else toast.error(error || 'Failed to delete device');
    } catch {
      toast.error('Failed to delete device');
    }
  };

  return (
    <div className='space-y-4'>
      <Button onClick={() => setIsUserDeviceModalOpen(true)}>
        <Plus />
        Add Device
      </Button>
      {devices.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <TabletIcon />
            </EmptyMedia>
            <EmptyTitle>No devices found</EmptyTitle>
            <EmptyDescription>
              If you have an e-reader with Koreader add it!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setIsUserDeviceModalOpen(true)}>
              Add Device
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className='flex flex-col gap-4'>
          {devices.map((device) => (
            <Card key={device.id}>
              <CardHeader className='py-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <TabletIcon className='size-5' />
                    <CardTitle>{device.device_name}</CardTitle>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className='text-destructive hover:text-destructive hover:bg-destructive/10'
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
                <CardDescription>
                  Created: {new Date(device.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Code: {device.device_code}</p>
                <p>Email: {device.user_email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <BookDeviceModal
        open={isUserDeviceModalOpen}
        onOpenChange={() => setIsUserDeviceModalOpen(false)}
      />
      <ConfirmationModal
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        onSubmit={handleDeleteDevice}
      />
    </div>
  );
}

export default DevicesList;
