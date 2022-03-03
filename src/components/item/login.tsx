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
  function getClassByProvider(name: string): string {
    switch (name) {
      case 'google':
      default:
        return 'bg-red-600 text-white hover:bg-red-400';
    }
  }

  return (
    <Main
      meta={
        <Meta
          title="Open data survey: Login"
          description="เข้าสู่ระบบ Open data survey"
        />
      }
    >
      <div className="h-full w-full flex justify-center items-center">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className={`rounded-2xl py-3 px-7 transition-all ease-linear ${getClassByProvider(
                provider.id
              )}`}
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </Main>
  );
}
