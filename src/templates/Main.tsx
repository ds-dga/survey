import { ReactNode } from 'react';

import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="min-h-screen h-full text-gray-800 bg-slate-200">
    {props.meta}
    <BottomNav />
    {/* <SidebarNav /> */}
    <main className="min-h-screen flex flex-col flex-grow transition-all duration-150 ease-in">
      {props.children}
    </main>
    <Footer />
  </div>
);

export { Main };
