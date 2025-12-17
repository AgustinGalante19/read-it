'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addUserDevice } from '@/services/UserDevicesService';
import { toast } from 'sonner';

interface BookDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateRandomCode(length: number = 8): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function BookDeviceModal({ open, onOpenChange }: BookDeviceModalProps) {
  const { data: session } = useSession();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCode(generateRandomCode());
      setName('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    addUserDevice(name, code)
      .then(({ success }) => {
        if (!success) {
          return toast.error('Error adding device:');
        }
        toast.success('Device added successfully!');
      })
      .catch(() => toast.error('Error adding device:'))
      .finally(() => {
        setIsLoading(false);
        onOpenChange(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>E-Reader Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={session?.user?.email || ''}
              disabled
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='code'>Código</Label>
            <Input id='code' type='text' value={code} disabled />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre</Label>
            <Input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ingrese el nombre del dispositivo'
              required
            />
          </div>

          <Button type='submit' className='w-full' isLoading={isLoading}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
