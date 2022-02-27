import { ReactNode } from 'react';

import BottomNav from '@/components/BottomNav';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="flex flex-row min-h-screen text-gray-800 bg-slate-200">
    {props.meta}
    <BottomNav />
    {/* <SidebarNav /> */}
    <main className="flex flex-col flex-grow transition-all duration-150 ease-in m-5">
      {props.children}
    </main>
  </div>
);

export { Main };
