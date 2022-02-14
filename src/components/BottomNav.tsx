import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 inline-flex justify-between bg-blue-600 w-11/12 rounded-3xl z-20 ">
      <Link href={'/'}>
        <a
          aria-current="page"
          className="inline-flex flex-col items-center text-xs font-medium py-3 px-4 text-white flex-grow transition-all hover:bg-blue-200 hover:rounded-3xl hover:text-blue-600"
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

      <Link href={'/nextjs'}>
        <a
          className="inline-flex flex-col items-center text-xs font-medium text-blue-400 py-3 px-4 flex-grow transition-all hover:bg-blue-200 hover:rounded-3xl hover:text-blue-600"
          href="#"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Chat</span>
        </a>
      </Link>

      <button className="relative inline-flex flex-col items-center text-xs font-medium text-white py-3 px-6 flex-grow">
        <div className="absolute bottom-4 p-3 rounded-full border-2 border-blue-600 bg-blue-600 hover:border-blue-400 hover:bg-blue-400 hover:bottom-6 transition-all ease-in-out delay-50">
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <span className="sr-only">Upload</span>
      </button>

      <a
        className="inline-flex flex-col items-center text-xs font-medium text-blue-400 py-3 px-4 flex-grow transition-all hover:bg-blue-200 hover:rounded-3xl hover:text-blue-600"
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
      <a
        className="inline-flex flex-col items-center text-xs font-medium text-blue-400 py-3 px-4 flex-grow transition-all hover:bg-blue-200 hover:rounded-3xl hover:text-blue-600"
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
    </div>
  );
}
