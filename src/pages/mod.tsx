import ModeratorTask from '@/components/ModeratorTask';
import UserProvider from '@/components/UserProvider';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Profile() {
  const account = UserProvider();
  const isMod = account.role === 'mod';

  // const router = useRouter();

  return (
    <Main
      meta={
        <Meta title="Moderate contents" description="Open data survey it is" />
      }
    >
      <div className="m-5 min-h-screen">
        {!isMod && (
          <p>
            You ain&apos;t supposed to be here or we&apos;re still checking.
          </p>
        )}
        {isMod && <ModeratorTask />}
      </div>
    </Main>
  );
}
