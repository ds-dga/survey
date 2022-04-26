import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

import ChatBubble from '@/icons/ChatBubble';
import LinkIcon from '@/icons/LinkIcon';
import { displayDatetime } from '@/libs/day';
import { extractHashRoute } from '@/libs/route';

import Modal from '../modal';
import CommentList from './comment';
import CommentForm from './commentForm';
import Provider from './provider';
import Related from './related';
import VoteInline from './vote-inline';

/*  Item only handles the rendering part and won't deal with fetching
any extra data related. That's why something like # of comments will be
missing due to the limitation of query and how we store comments.
*/
export default function Item({ item, commentTotal }: any) {
  const [NoAuthHidden, SetHideNoAuth] = useState(true);
  const { status: sessStatus } = useSession();
  const router = useRouter();
  const isDetailPage = router.route === '/n/[ID]';
  const [showComment, SetShowComment] = useState(shouldShowCommment(router));
  const moded = itemProcessor(item);
  const detailView = router.pathname === '/n/[ID]';

  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 pb-3 px-5">
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
      <div className="pt-3 flex gap-3">
        {/* <Vote datasetID={moded.id} initialValue={moded.vote} /> */}
        <div>
          <Link href={`/category/${moded.category.id}`} passHref>
            <span className="mt-1 zmax-w-2xl text-sm text-gray-500 cursor-pointer">
              {moded.category.name}
            </span>
          </Link>
          <h3 className="text-xl leading-6 font-medium text-gray-900">
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
        <span className="px-1">
          {moded.vote.latest ? `${displayDatetime(moded.vote.latest)} | ` : ''}
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
          ความเห็นต่อชุดข้อมูล <ChatBubble className="inline text-xl" />
        </button>
      </div>

      <CommentForm
        parentType={'dataset'}
        parentID={moded.id}
        hidden={!showComment}
      />
      <CommentList
        parentType={'dataset'}
        parentID={moded.id}
        hidden={!showComment}
        toggleVisibility={SetShowComment}
      />

      <div className="mt-5 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
        <div className="relative border-l-4 border-green-400 pl-2">
          <Related items={moded.related} datasetID={moded.id} />
        </div>

        <div className="relative border-l-4 border-pink-400 pl-2">
          <Provider orgs={moded.providers} datasetID={moded.id} />
        </div>
      </div>
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

function shouldShowCommment(router: NextRouter) {
  const { route, asPath } = router;
  if (route !== '/n/[ID]') return false;
  const hashOpt = extractHashRoute(asPath);
  if (hashOpt.length !== 1) return false;
  if (hashOpt[0] === 'comment') return true;
  return false;
}
