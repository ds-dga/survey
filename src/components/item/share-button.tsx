import FacebookIcon from '@/icons/FacebookIcon';

type ShareButtonProps = {
  link: string;
};

export default function ShareButton({ link }: ShareButtonProps) {
  return (
    <a
      className="bg-blue-700 text-white px-2 text-sm rounded hover:bg-blue-500"
      href={`https://www.facebook.com/sharer.php?u=${link}`}
    >
      <span className="flex gap-1 items-center">
        <FacebookIcon /> Share
      </span>
    </a>
  );
}
