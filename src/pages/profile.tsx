import { useSession } from 'next-auth/react';
import Link from 'next/link';

import LoggedProfile from '@/components/LoggedProfile';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // const router = useRouter();

  return (
    <Main meta={<Meta title="Profile" description="Open data survey it is" />}>
      {loading && <p>Loading...</p>}
      {session && <LoggedProfile user={session.user} />}
      {!session && (
        <div>
          <Link href={`/api/auth/signin`}>Login</Link>
        </div>
      )}
    </Main>
  );
};

export default Index;
