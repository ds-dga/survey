import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

import { getColor, getArrow } from '@/components/common';
import { displayDatetime } from '@/libs/day';

export default function ModRecentDatasetLikes() {
  const { data } = useQuery(RECENT_LIKES, {
    variables: {
      limit: 10,
      offset: 0,
      where: {
        voted_by: { _is_null: false },
      },
      orderBy: [{ updated_at: 'desc' }],
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {data?.items.length === 0 && <div>ยังไม่มีการโหวต</div>}
      {data?.items.map((item) => (
        <LikeItem key={`like-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function LikeItem({ item }) {
  return (
    <div className="rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5">
      <Link href={`/n/${item.dataset.id}`} passHref>
        <div className="text-teal-600 flex gap-1 items-center self-center content-center cursor-pointer">
          {/* <span className={`${getColor(item.point)}`}>
            {item.dataset.score.aggregate.sum.point || 0}
          </span> */}
          <span className={`text-2xl ${getColor(item.point)}`}>
            {getArrow(item.point)}
          </span>
          {item.dataset.name}
        </div>
      </Link>
      <div className="text-gray-500 text-xs pl-7">
        <Link href={`/category/${item.dataset.category.id}`} passHref>
          {item.dataset.category.name}
        </Link>
        <br />
        โดย <span className="text-sm text-slate-600">
          {item.user.name}
        </span>{' '}
        เมื่อวันที่ {displayDatetime(item.updated_at)}
      </div>
    </div>
  );
}

const RECENT_LIKES = gql`
  query RECENT_LIKES(
    $where: dataset_points_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: [dataset_points_order_by!]
  ) {
    items: dataset_points(
      where: $where
      offset: $offset
      limit: $limit
      order_by: $orderBy
    ) {
      id
      updated_at
      voted_by
      point
      user {
        name
      }
      dataset {
        id
        name
        category {
          name
          id
        }
      }
    }
  }
`;
