import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import ChatBubble from '@/icons/ChatBubble';
import LinkIcon from '@/icons/LinkIcon';
import { displayDate } from '@/libs/day';

import Modal from '../modal';
import StatusDot from './dot';
import VoteInline from './vote-inline';

export default function MinimalItem({ item, commentTotal }: any) {
  const [NoAuthHidden, SetHideNoAuth] = useState(true);
  const { status: sessStatus } = useSession();
  const router = useRouter();
  const isDetailPage = router.route === '/n/[ID]';
  const [showComment, SetShowComment] = useState(false);
  const moded = itemProcessor(item);
  const detailView = router.pathname === '/n/[ID]';
  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-0 pb-2 px-3">
      {!NoAuthHidden && <Modal hidden={false} handleHidden={SetHideNoAuth} />}
      {!detailView && (
        <span className="float-right">
          <Link passHref href={`/n/${moded.id}`}>
            <div className="text text-gray-500 mt-1 zmax-w-2xl text-xl cursor-pointer">
              <LinkIcon className="inline" fill={'#10b981'} />
            </div>
          </Link>
        </span>
      )}
      <div className="flex gap-3">
        {/* <Vote datasetID={moded.id} initialValue={moded.vote} /> */}
        <div>
          <Link href={`/category/${moded.category.id}`} passHref>
            <span className="mt-1 zmax-w-2xl text-xs text-gray-500 cursor-pointer">
              {moded.category.name}
            </span>
          </Link>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-1">
            <StatusDot state={moded.status} />
            {moded.name}
          </h3>
        </div>
      </div>
      <div className="text-sm text-gray-500 flex">
        <VoteInline
          datasetID={moded.id}
          initialValue={moded.vote}
          noAuthHidden={NoAuthHidden}
          SetHideNoAuth={SetHideNoAuth}
        />
        &nbsp;|&nbsp;
        {/* {moded.related_aggregate.aggregate.count} */}
        {/* {moded.providers_aggregate.aggregate.count} */}
        <span className="px-1">
          {moded.vote.latest ? `${displayDate(moded.vote.latest)} | ` : ''}
        </span>
        <button
          className="text-sm font-medium text-sky-500"
          onClick={() => {
            if (sessStatus !== 'authenticated') {
              SetHideNoAuth(false);
            } else if (isDetailPage) {
              SetShowComment(!showComment);
            } else {
              router.push(`/n/${moded.id}/#comment`);
            }
          }}
        >
          {commentTotal && `${commentTotal.aggregate.count} `}
          ความเห็น <ChatBubble className="inline text-xl" />
        </button>
      </div>

      {/* <div className="relative rounded transition delay-150 origin-bottom -rotate-12 scale-150 text-xl opacity-80 border-4 py-1 px-4 w-fit -translate-x-8 -translate-y-8 float-right cursor-pointer bg-green-100 text-green-700 border-green-700 hover:bg-teal-100 hover:text-teal-800 hover:border-teal-800">
        เรียบร้อย ⬇️
      </div> */}
    </div>
  );
}

function itemProcessor(item) {
  const moded = {
    ...item,
    vote: { up: 0, down: 0, latest: null, mine: 0 },
    comments: [],
  };
  if (item.points.length > 0) {
    moded.vote.up = item.vote_up.aggregate.sum.point;
    moded.vote.down = item.vote_down.aggregate.sum.point;
    moded.vote.latest = item.points[0].updated_at;
  }
  if (item.my_vote.length > 0) {
    moded.vote.mine = item.my_vote[0].point;
  }
  return moded;
}
