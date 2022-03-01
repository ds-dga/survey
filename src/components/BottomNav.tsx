import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNav() {
  const { basePath, route } = useRouter();
  return (
    <div className="fixed bottom-0 z-20 left-1/2 transform -translate-x-1/2 inline-flex justify-between bg-white w-full md:w-6/12 md:bottom-2 md:rounded-3xl md:border-4 md:border-blue-500">
      <Link href={'/'}>
        <a
          aria-current="page"
          className={`inline-flex flex-col items-center text-xs font-medium py-3 px-4 ${
            route === '/'
              ? 'text-rose-400 hover:text-rose-600'
              : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100 hover:rounded-3xl'
          } flex-grow transition-all `}
          href="#"
        >
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <span className="sr-only">Home</span>
        </a>
      </Link>

      <Link href={'/category'}>
        <a
          className={`inline-flex flex-col items-center text-xs font-medium ${
            route === '/category'
              ? 'text-rose-400 hover:text-rose-600'
              : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100 hover:rounded-3xl'
          } py-3 px-4 flex-grow transition-all `}
          href="#"
        >
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M464 352H320a16 16 0 00-16 16 48 48 0 01-96 0 16 16 0 00-16-16H48a16 16 0 00-16 16v64a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64v-64a16 16 0 00-16-16zM479.46 187.88L447.61 68.45C441.27 35.59 417.54 16 384 16H128c-16.8 0-31 4.69-42.1 13.94S67.66 52 64.4 68.4L32.54 187.88A15.9 15.9 0 0032 192v48c0 35.29 28.71 80 64 80h320c35.29 0 64-44.71 64-80v-48a15.9 15.9 0 00-.54-4.12zM440.57 176H320a15.92 15.92 0 00-16 15.82 48 48 0 11-96 0A15.92 15.92 0 00192 176H71.43a2 2 0 01-1.93-2.52L95.71 75c3.55-18.41 13.81-27 32.29-27h256c18.59 0 28.84 8.53 32.25 26.85l26.25 98.63a2 2 0 01-1.93 2.52z" />
          </svg>
          <span className="sr-only">Category</span>
        </a>
      </Link>

      <div className={`inline-flex flex-col items-center justify-center`}>
        <img
          className={`h-10`}
          src={`${basePath}/assets/logo/digi.png`}
          alt="DIGI"
        />
      </div>

      <a
        className={`inline-flex flex-col items-center text-xs font-medium ${
          route === '/search'
            ? 'text-rose-400 hover:text-rose-600'
            : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100 hover:rounded-3xl'
        } py-3 px-4 flex-grow transition-all `}
        href="#"
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Search</span>
      </a>

      <Link href={'/profile'}>
        <a
          className={`inline-flex flex-col items-center text-xs font-medium ${
            route === '/profile'
              ? 'text-rose-400 hover:text-rose-600'
              : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100 hover:rounded-3xl'
          } py-3 px-4 flex-grow transition-all `}
          href="#"
        >
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Profile</span>
        </a>
      </Link>
    </div>
  );
}
