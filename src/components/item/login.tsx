import { signIn } from 'next-auth/react';

import Fingerprint from '@/icons/Fingerprint';
import GoogleIcon from '@/icons/GoogleIcon';

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
      case 'digitalid':
        return 'bg-white text-black hover:bg-zinc-300';
      case 'google':
      default:
        return 'bg-red-600 text-white hover:bg-red-400';
    }
  }
  function getLabelByProvider(provider: ProviderProps): JSX.Element {
    switch (provider.id) {
      case 'digitalid':
        return (
          <span className="flex gap-1 items-center">
            <Fingerprint /> Digital ID
          </span>
        );
      case 'google':
        return (
          <span className="flex items-center">
            <GoogleIcon />
            oogle
          </span>
        );
      default:
        return <span>{`Sign in with ${provider.name}`}</span>;
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center align-middle">
      <div className="text-xl m-5 text-slate-500">เข้าสู่ระบบ</div>
      <div className="flex gap-5">
        {Object.values(providers).map((provider) => {
          return (
            <div key={provider.name}>
              <button
                className={`rounded-2xl py-3 px-7 transition-all ease-linear ${getClassByProvider(
                  provider.id
                )}`}
                onClick={() => signIn(provider.id)}
              >
                {getLabelByProvider(provider)}
              </button>
            </div>
          );
        })}
      </div>
      <div className="m-5 text-slate-500">
        <ul className="list-disc text-sm">
          <li>กรณีบุคคลธรรมดา แนะนำให้ใช้การเข้าสู่ระบบด้วย Google</li>
          <li>
            กรณีเจ้าหน้าที่รัฐ แนะนำให้ใช้การเข้าสู่ระบบด้วย Digital ID
            และยืนยัน email ของหน่วยงานของท่าน
          </li>
        </ul>
      </div>
    </div>
  );
}
