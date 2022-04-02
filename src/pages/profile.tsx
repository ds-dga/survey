import { getProviders, useSession } from 'next-auth/react';

import Login from '@/components/item/login';
import Loading from '@/components/loading';
import LoggedProfile from '@/components/LoggedProfile';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Profile({ providers }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // const router = useRouter();

  return (
    <Main meta={<Meta title="Profile" description="Open data survey it is" />}>
      <div className="m-5 min-h-screen">
        <Loading hidden={!loading} />
        {session && <LoggedProfile user={session.user} />}
        {!session && <Login providers={providers} />}
      </div>
    </Main>
  );
}

export async function getServerSideProps() {
  return { props: { providers: await getProviders() } };
}
