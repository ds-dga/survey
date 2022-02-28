import { useState } from 'react';

import ArrowDown from '@/icons/ArrowDown';
import ArrowUp from '@/icons/ArrowUp';
import Check from '@/icons/Check';
import Stop from '@/icons/Stop';
import { displayDatetime } from '@/libs/day';

import CommentList from './comment';
import CommentForm from './commentForm';
import Provider from './provider';
import Vote from './vote';

export default function Item({ item }: any) {
  const [showComment, SetShowComment] = useState(false);
  const moded = {
    ...item,
    vote: { up: 0, down: 0, latest: null, mine: 0 },
    comments: [],
  };
  if (item.points.length > 0) {
    moded.vote.up = item.vote_up.aggregate.sum.point;
    moded.vote.down = item.vote_down.aggregate.sum.point;
    moded.vote.latest = item.points[0].created_at;
  }
  if (item.my_vote.length > 0) {
    moded.vote.mine = item.my_vote[0].point;
  }
  // console.log(item);
  // console.log(moded);

  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 pb-3 px-5">
      <div className="pt-3 flex gap-3">
        <Vote datasetID={moded.id} initialValue={moded.vote} />
        <div>
          <p className="mt-1 zmax-w-2xl text-sm text-gray-500">
            {moded.category.name}
          </p>
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {moded.name}
          </h3>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          {/* <h3 className="text-sm text-gray-700">
          {moded.vote.up} โหวต
          </h3> */}
          <div className="text-sm text-gray-500">
            {moded.vote.latest
              ? `${displayDatetime(moded.vote.latest)} | `
              : ''}
            {moded.vote.up || 0} โหวต{' '}
            <ArrowUp className="inline" fill={'#10b981'} />{' '}
            {Math.abs(moded.vote.down) || 0} โหวต{' '}
            <ArrowDown className="inline" fill={'#fb7185'} />
          </div>
        </div>
        <button
          className="text-sm font-medium text-gray-900"
          onClick={() => {
            SetShowComment(!showComment);
          }}
        >
          {moded.comments.length} ความคิดเห็น
        </button>
      </div>

      <CommentForm hidden={!showComment} />
      {showComment && <CommentList />}

      <div className="mt-5 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
        <div className="relative border-l-4 border-green-400 pl-2">
          <div className="text-gray-600 italic">
            {moded.related.length
              ? 'ข้อมูลที่ใกล้เคียง'
              : 'ยังไม่มีข้อมูลที่ใกล้เคียง'}
          </div>
          {moded.related.map((related: any, ind: number) => (
            <div className="flex gap-3" key={`${moded.id}-related-${ind}`}>
              <div className="text-2xl min-w-fit">
                <Check className="inline" fill={'#10b981'} />{' '}
                <Stop className="inline" fill={'#fb7185'} />
              </div>
              <div>
                <div>{related.title}</div>
                <div className="text-md text-gray-600">by {related.source}</div>
                <div className="text-sm text-gray-500">
                  {related.vote.up - related.vote.down} โหวต{' '}
                  <Check className="inline" /> {related.comments.length}{' '}
                  ความคิดเห็น
                </div>

                <CommentForm hidden={!showComment} />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="mt-5 px-4 py-1 text-sm rounded-full text-white hover:text-white hover:border-transparent focus:outline-none focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-400 hover:scale-105 ease-in-out duration-300"
          >
            เพิ่มข้อมูลเปิดที่ใกล้เคียง
          </button>
        </div>

        <div className="relative border-l-4 border-pink-400 pl-2">
          <Provider orgs={moded.providers} datasetID={moded.id} />
        </div>
      </div>
    </div>
  );
}
