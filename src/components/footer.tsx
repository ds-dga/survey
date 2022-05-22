import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Footer() {
  const { basePath } = useRouter();
  return (
    <footer className="bg-slate-50 border-t-2 border-slate-200 pb-52 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 h-32 p-5 gap-5">
        <div className="">
          <div className="flex self-center justify-center">
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
        <div className="text-sm text-slate-500 text-center">
          <h3 className="font-bold">Open data survey</h3>
          <ul>
            <li>
              <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
            </li>
          </ul>
        </div>
        <div className="text-center text-slate-500 text-sm">
          <p>สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) (สพร.)</p>
          <p>
            Digital Government Development Agency
            <br />
            (Public Organization) (DGA)
          </p>
          <p className="text-xs">Contact Center (+66) 0 2612 6060</p>
          <p className="text-xs">อีเมล contact@dga.or.th</p>
        </div>
      </div>
    </footer>
  );
}
