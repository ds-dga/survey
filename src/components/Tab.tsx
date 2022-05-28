type TabProps = {
  items: string[];
  active?: string;
  handleTabChanged: Function;
};

export default function Tab({ active, items, handleTabChanged }: TabProps) {
  return (
    <ul
      className="nav nav-tabs nav-justified flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4"
      id="tabs-tabJustify"
      role="tablist"
    >
      {items?.map((item, ind) => (
        <li
          key={`tab-${ind}-${item}`}
          className={`cursor-pointer nav-item flex-grow text-center ${
            active === item ? 'active' : ''
          }`}
          role="presentation"
          onClick={() => {
            handleTabChanged(item);
          }}
        >
          <a
            className={`nav-link w-full block font-light text-sm leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent ${
              active === item ? 'border-blue-500 bg-slate-300' : ''
            }`}
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
}
