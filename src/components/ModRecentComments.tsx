import { gql, useQuery } from '@apollo/client';

import { displayDatetime } from '@/libs/day';

export default function ModRecentComments() {
  const { data } = useQuery(RECENT_COMMENTS, {
    variables: {
      limit: 10,
      offset: 0,
      where: {},
      orderBy: [{ created_at: 'desc' }],
    },
  });

  console.log(data);
  return (
    <>
      {/* <Paginator /> */}
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

function CommentItem({ comment }) {
  console.log(comment);
  return (
    <div className="rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5 text-slate-600">
      <div className="float-right bg-pink-800 text-white px-2 text-xs rounded hover:bg-pink-500">
        {PARENT_TYPE_CONV[comment.parent_type]}
      </div>
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
      created_by
      created_at
      parent_type
      parent_id
      user {
        name
      }
    }
  }
`;
