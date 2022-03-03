import { useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';

import Item from '@/components/item';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Search() {
  const [Q, SetQ] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: session } = useSession();
  let userWhere = {};
  if (session) {
    userWhere = {
      voted_by: {
        _eq: session.user.uid,
      },
    };
  }
  let whereArgs = {};
  if (Q.length > 0) {
    whereArgs = {
      name: { _ilike: `%${Q}%` },
    };
    // whereArgs = {
    //   _or: [
    //     { name: { _ilike: `%${Q}%` } },
    //     { category: { name: { _ilike: `%${Q}%` } } },
    //   ],
    // }
  }
  const gqlVars = {
    votedByWhere: userWhere,
    relatedVotedWhere: userWhere,
    providerVotedWhere: userWhere,
    where: whereArgs,
    limit: 10,
    offset: 0,
  };
  const { data, loading, fetchMore } = useQuery(DATASET_SEARCH_QUERY, {
    variables: gqlVars,
    pollInterval: 1000 * 7, // 7s
    fetchPolicy: 'network-only',
  });

  const currTotal = (data && data.items.length) || 0;
  const total = (data && data.total.aggregate.count) || 0;
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
      updateQuery: (previousResult: Results, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          ...previousResult, // Append the new crop results to the old one
          items: [...previousResult.items, ...fetchMoreResult.items],
        };
      },
    });
    // console.log("oad more res: ", res)
  }
  return (
    <Main
      meta={
        <Meta title="Open data survey" description="Open data survey it is" />
      }
    >
      <h1 className="font-semibold text-2xl text-gray-700 text-center mb-5">
        รายการข้อมูลเปิดที่ประชาชนต้องการจากภาครัฐ
      </h1>
      {loading && <p>Loading...</p>}
      {/* {session && <LoggedProfile user={session.user} />}
        {!session && (
          <div>
            <Link href={`/api/auth/signin`}>Login</Link>
          </div> */}
      {/* )} */}
      <div className="">
        <input
          className="form-input text-xl px-4 py-3 rounded-md w-full border-0 hover:shadow-md active:border-0"
          type="text"
          defaultValue={Q}
          placeholder="ค้นหา..."
          onChange={(e) => {
            const v = e.target.value.trim();
            SetQ(v);
          }}
          autoComplete="off"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6">
        {data &&
          data.items.map((item) => <Item key={`s-${item.id}`} item={item} />)}
      </div>

      {data &&
        data.items &&
        hasMore &&
        (isLoadingMore ? (
          <p>Loading ....</p>
        ) : (
          <button
            onClick={async () => {
              console.log('click : ', gqlVars);
              setIsLoadingMore(true);
              loadMore(currTotal);
              setIsLoadingMore(false);
            }}
          >
            Load More
          </button>
        ))}

      <div className="mb-20"></div>
    </Main>
  );
}

const DATASET_SEARCH_QUERY = gql`
  query DATASET_SEARCH_QUERY(
    $where: dataset_bool_exp!
    $votedByWhere: dataset_points_bool_exp!
    $relatedVotedWhere: related_points_bool_exp!
    $providerVotedWhere: provider_points_bool_exp!
    $limit: Int!
    $offset: Int!
  ) {
    total: dataset_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    items: dataset(
      where: $where
      order_by: [
        { points_aggregate: { sum: { point: desc_nulls_last } } }
        { id: asc }
      ]
      offset: $offset
      limit: $limit
    ) {
      id
      name
      category {
        id
        name
      }
      my_vote: points(where: $votedByWhere) {
        point
      }
      related {
        id
        maintainer
        title
        url
        created_by
        my_vote: points(where: $relatedVotedWhere) {
          point
        }
        points(order_by: [{ created_at: desc }], limit: 1) {
          created_at
        }
        vote_up: points_aggregate(where: { point: { _gte: 0 } }) {
          aggregate {
            sum {
              point
            }
          }
        }
        vote_down: points_aggregate(where: { point: { _lt: 0 } }) {
          aggregate {
            sum {
              point
            }
          }
        }
      }
      providers {
        id
        name
        created_by
        points(order_by: [{ created_at: desc }], limit: 1) {
          created_at
        }
        my_vote: points(where: $providerVotedWhere) {
          point
        }
        vote_up: points_aggregate(where: { point: { _gte: 0 } }) {
          aggregate {
            sum {
              point
            }
          }
        }
        vote_down: points_aggregate(where: { point: { _lt: 0 } }) {
          aggregate {
            sum {
              point
            }
          }
        }
      }
      points(order_by: [{ created_at: desc }], limit: 1) {
        created_at
      }
      vote_up: points_aggregate(where: { point: { _gte: 0 } }) {
        aggregate {
          sum {
            point
          }
        }
      }
      vote_down: points_aggregate(where: { point: { _lt: 0 } }) {
        aggregate {
          sum {
            point
          }
        }
      }
    }
  }
`;
