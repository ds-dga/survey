export default function SidebarNav() {
  return (
    <div className="fixed bg-purple-400/80 mx-auto min-h-screen transition-all duration-150 ease-in z-10 w-32 -left-32 md:left-0">
      <ul>
        <li>
          <span role="img" aria-label="fire">
            🔥
          </span>{' '}
          <a href="https://nextjs.org" rel="nofollow">
            Next.js
          </a>{' '}
          for Static Site Generator
        </li>
        <li>
          <span role="img" aria-label="art">
            🎨
          </span>{' '}
          Integrate with{' '}
          <a href="https://tailwindcss.com" rel="nofollow">
            Tailwind CSS
          </a>
        </li>
      </ul>
    </div>
  );
}
