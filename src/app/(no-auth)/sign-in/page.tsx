'use client';

import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function SignInPage() {
  const { push } = useRouter();
  const { data } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
      push('/');
    }
  }, [data?.user, push]);

  return (
    <div className='min-h-screen flex justify-center items-center login-bg'>
      <div className='w-10/12'>
        <h2 className='text-white text-3xl font-bold mb-2'>Login</h2>
        <div className='bg-secondary/90 p-4 flex-col flex justify-center rounded-md'>
          <span className='mb-2 text-sm text-secondary-foreground'>
            To accede to the all app features you must be authenticated
          </span>
          <Button
            className='w-full'
            onClick={async () => {
              setIsLoading(true);
              await signIn.social({ provider: 'google' });
              setIsLoading(false);
              push('/');
            }}
            isLoading={isLoading}
          >
            <GoogleIcon />
            Login with Google
          </Button>
          <span className='text-sm text-secondary-foreground mt-2'>
            You can acceed to an app preview to see the features.{' '}
            <Link
              href='/preview'
              className='text-primary underline font-semibold'
            >
              Click here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
