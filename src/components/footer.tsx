import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Footer() {
  const { basePath } = useRouter();
  return (
    <footer className="bg-slate-50 border-t-2 border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-3 h-32 p-5">
        <div className="hidden md:block">
          <div className="flex self-center">
            <img
              className={`h-10`}
              src={`${basePath}/assets/logo/digi.png`}
              alt="DIGI"
            />
            <img
              className={`h-10`}
              src={`${basePath}/assets/logo/dga.png`}
              alt="DGA"
            />
          </div>
        </div>
        <div className="text-center text-slate-500 hidden md:block">
          <p>สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) (สพร.)</p>
          <p>
            Digital Government Development Agency (Public Organization) (DGA)
          </p>
        </div>
        <div className="text-sm text-slate-500 text-right">
          <h3 className="font-bold">Open data survey</h3>
          <ul>
            <li>
              <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="pb-20"></div>
    </footer>
  );
}
