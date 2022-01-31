import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Blank() {
  return (
    <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
      <div className="flex flex-col flex-grow border-4 border-gray-400 border-dashed bg-white rounded mt-4">
        BLANK
      </div>
      <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
        {' '}
        When you look&nbsp;
        <span className="relative">
          <span
            className="block absolute -inset-1 -skew-y-3 bg-amber-500 "
            aria-hidden="true"
          ></span>
          <span className="relative text-white after:content-['__↗']">
            annoyed
          </span>
        </span>
        &nbsp;all the time, people think that you&apos;re busy.
      </blockquote>
    </Main>
  );
}
