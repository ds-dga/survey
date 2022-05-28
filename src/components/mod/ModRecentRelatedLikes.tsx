import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

import { getColor, getArrow } from '@/components/common';
import ExternalLink from '@/icons/ExternalLink';
import { displayDate } from '@/libs/day';

export default function ModRecentRelatedLikes() {
  const { data } = useQuery(RECENT_RELATED_LIKES, {
    variables: {
      limit: 10,
      offset: 0,
      where: {
        voted_by: { _is_null: false },
      },
      orderBy: [{ day: 'desc' }],
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {data?.items.length === 0 && <div>ยังไม่มีการโหวต</div>}
      {data?.items.map((item) => (
        <RelatedPointItem key={`related-item-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function RelatedPointItem({ item }) {
  const { parent } = item;

  return (
    <div className="rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5">
      <div className="text-teal-600 flex gap-1 items-center self-center content-center cursor-pointer">
        {/* <span className={`${getColor(item.point)}`}>
            {parent.dataset.score.aggregate.sum.point || 0}
          </span> */}
        <span className={`text-2xl ${getColor(item.point)}`}>
          {getArrow(item.point)}
        </span>
        <Link href={`/n/${parent.dataset.id}`} passHref>
          <span className="hover:bg-green-100">{parent.title}</span>
        </Link>
        {parent.url && (
          <a href={parent.url} target="_blank" rel="noreferrer">
            <span className="hover:text-red-500 hover:bg-red-100">
              <ExternalLink />
            </span>
          </a>
        )}
      </div>
      <Link href={`/n/${parent.dataset.id}`} passHref>
        <div className="text-gray-500 text-md pl-7 cursor-pointer hover:bg-green-100">
          <span className="text-gray-700">{parent.dataset.name}</span>
          <br />
          โดย <span className="text-sm text-slate-500">
            {item.user.name}
          </span>{' '}
          เมื่อวันที่ {displayDate(item.day)}
        </div>
      </Link>
    </div>
  );
}

const RECENT_RELATED_LIKES = gql`
  query RECENT_RELATED_LIKES(
    $where: related_points_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: [related_points_order_by!]
  ) {
    items: related_points(
      where: $where
      offset: $offset
      limit: $limit
      order_by: $orderBy
    ) {
      id
      day
      voted_by
      point
      user {
        name
      }
      parent: related {
        title
        url
        dataset {
          id
          name
        }
      }
    }
  }
`;
