export default function Loading({ hidden }) {
  return (
    <div
      className={`${
        hidden ? 'hidden' : ''
      } rounded z-20 absolute top-0 right-0 py-1 px-3 bg-yellow-100 text-black`}
    >
      Loading...
    </div>
  );
}
