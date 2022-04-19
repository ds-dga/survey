import { useState } from 'react';

import { useQuery, gql } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import ThumbDown from '@/icons/ThumbDown';
import ThumbUp from '@/icons/ThumbUp';
import { displayDatetime } from '@/libs/day';

import Loading from './loading';

export default function myVoteHistory() {
  const { data: session } = useSession();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data, loading, fetchMore } = useQuery(MY_VOTE_QUERY, {
    variables: {
      offset: 0,
      limit: 10,
      userID: session?.user.uid,
    },
    skip: !session,
  });

  const currTotal = data?.items.length || 0;
  const total = data?.total.aggregate.count || 0;
  const hasMore = total > currTotal;

  interface Item {
    id: string;
    name: string;
  }

  interface Results {
    items: Item[];
  }
  async function loadMore(numTotal) {
    // I really have no idea why we still use 'updateQuery' while I thought it is deprecated..??
    fetchMore({
      variables: {
        offset: numTotal,
      },
      updateQuery: (previousResult: Results, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          ...previousResult, // Append the new crop results to the old one
          items: [...previousResult.items, ...fetchMoreResult.items],
        };
      },
    });
  }

  return (
    <>
      <ul className="list-inside space-y-2">
        <Loading hidden={!loading} />
        {data &&
          data.items.map((item) => (
            <li key={`ifv-${item.id}`}>
              <Link href={`/n/${item.dataset.id}`} passHref>
                <div className="text-teal-600 flex gap-1 items-center self-center content-center cursor-pointer">
                  <span className={`${getColor(item.point)}`}>
                    {item.dataset.score.aggregate.sum.point || 0}
                  </span>
                  <span className={`${getColor(item.point)}`}>
                    {getArrow(item.point)}
                  </span>
                  {item.dataset.name}
                </div>
              </Link>
              <div className="text-gray-500 text-xs pl-8">
                <Link href={`/category/${item.dataset.category.id}`} passHref>
                  {item.dataset.category.name}
                </Link>
                <br />
                เมื่อวันที่ {displayDatetime(item.created_at)}
              </div>
            </li>
          ))}
        {data?.items.length === 0 && <li>ยังไม่เคยโหวต</li>}
      </ul>
      {data?.items &&
        hasMore &&
        data.items.length < total &&
        (isLoadingMore ? (
          <Loading hidden={false} />
        ) : (
          <button
            className="w-full rounded-md bg-slate-50 py-2 my-5 text-md text-center transition-all duration-150 ease-in hover:bg-lime-100"
            onClick={async () => {
              setIsLoadingMore(true);
              loadMore(currTotal);
              setIsLoadingMore(false);
            }}
          >
            ดูเพิ่มเติม{' '}
            <span className="text-sm text-gray-600">
              ({currTotal} จากทั้งหมด {total} รายการ)
            </span>
          </button>
        ))}
    </>
  );
}

const MY_VOTE_QUERY = gql`
  query MY_VOTE_QUERY($userID: uuid!, $offset: Int!, $limit: Int!) {
    total: dataset_points_aggregate(where: { voted_by: { _eq: $userID } }) {
      aggregate {
        count
      }
    }
    items: dataset_points(
      where: { voted_by: { _eq: $userID } }
      order_by: { created_at: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      created_at
      point
      dataset {
        id
        name
        score: points_aggregate {
          aggregate {
            sum {
              point
            }
          }
        }
        category {
          name
          id
        }
      }
    }
  }
`;

function getColor(point: Number): string {
  if (point > 0) {
    return 'text-green-500';
  }
  if (point < 0) {
    return 'text-rose-500';
  }
  return '';
}

function getArrow(point: Number) {
  if (point > 0) {
    return <ThumbUp />;
    // return <ArrowUp />;
  }
  if (point < 0) {
    return <ThumbDown />;
    // return <ArrowDown />;
  }
  return <p>-</p>;
}
