export default function Loading({ hidden }) {
  return (
    <div
      className={`${
        hidden ? 'hidden' : ''
      } z-20 absolute top-0 right-0 py-1 px-3 bg-white`}
    >
      Loading...
    </div>
  );
}
