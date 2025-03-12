'use client';

import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';

function HomePage() {
  const { data } = useSession();

  console.log(data?.user);
  return (
    <div>
      {!data?.user ? (
        <Button onClick={() => signIn('google')}>Login</Button>
      ) : (
        <span>{data.user.name}</span>
      )}
    </div>
  );
}

export default HomePage;
