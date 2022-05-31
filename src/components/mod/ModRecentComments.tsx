import { useEffect } from 'react';

import { gql, useQuery } from '@apollo/client';

import { displayDatetime } from '@/libs/day';

import { PaginatorOffset } from '../Paginator';
import CommentHiddenToggle from './item-hidden';
import { ModRecentCommentsProps } from './mod-common';

function parentTypeConv(t: string) {
  if (t === 'ชุดข้อมูลใกล้เคียง') return 'related';

  return 'dataset';
}

export default function ModRecentComments({
  paginatorVars,
  handleItemTotalChanged,
  parentType,
}: ModRecentCommentsProps) {
  const where =
    parentType && parentType.length > 0
      ? { parent_type: { _eq: parentTypeConv(parentType) } }
      : {};

  const { data } = useQuery(RECENT_COMMENTS, {
    variables: {
      limit: paginatorVars.itemPerPage,
      offset: PaginatorOffset(paginatorVars),
      where,
      orderBy: [{ created_at: 'desc' }],
    },
  });

  useEffect(() => {
    if (!data) return;
    handleItemTotalChanged(data.items_total.aggregate.count);
  }, [data, handleItemTotalChanged]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {data?.comments.map((comment) => (
          <CommentItem key={`cmt-${comment.id}`} comment={comment} />
        ))}
      </div>
    </>
  );
}

const PARENT_TYPE_CONV = {
  dataset: 'ชุดข้อมูล',
  related: 'ชุดข้อมูลใกล้เคียง',
  provider: 'หน่วยงาน',
};

const CTYPE_LINK_PREFIX = {
  dataset: 'n',
  related: 'r',
};

function CommentItem({ comment }) {
  return (
    <div className="rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5 text-slate-600">
      <a
        href={`/${CTYPE_LINK_PREFIX[comment.parent_type]}/${
          comment.parent_id
        }#comment`}
        target="_blank"
        rel="noreferrer"
      >
        <div className="float-right text-right">
          <div className="bg-pink-800 text-white px-2 text-xs rounded hover:bg-pink-500">
            {PARENT_TYPE_CONV[comment.parent_type]}
          </div>
          <CommentHiddenToggle item={comment} />
        </div>
      </a>
      {comment.note}
      <div className="text-gray-500 text-xs ">
        โดย <span className="text-sm text-slate-600">{comment.user.name}</span>{' '}
        เมื่อวันที่ {displayDatetime(comment.created_at)}
      </div>
    </div>
  );
}

const RECENT_COMMENTS = gql`
  query RECENT_COMMENTS(
    $where: comments_bool_exp!
    $orderBy: [comments_order_by!]
    $limit: Int!
    $offset: Int!
  ) {
    comments(
      where: $where
      offset: $offset
      limit: $limit
      order_by: $orderBy
    ) {
      id
      note
      hidden
      created_at
      parent_type
      parent_id
      user {
        name
      }
    }
    items_total: comments_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
