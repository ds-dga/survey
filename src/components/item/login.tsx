import { signIn } from 'next-auth/react';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

type ProviderProps = {
  name: string;
  id: string;
};

type LoginProps = {
  providers: ProviderProps[];
};

export default function Login({ providers }: LoginProps) {
  return (
    <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </Main>
  );
}
