import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import Item from '.';
import Loading from '../loading';

export default function PopularGroup({ limit }: any) {
  const { data: session } = useSession();
  let userWhere = {};
  if (session) {
    userWhere = {
      voted_by: {
        _eq: session.user.uid,
      },
    };
  }
  const { data, loading } = useQuery(POPULAR_QUERY, {
    variables: {
      votedByWhere: userWhere,
      relatedVotedWhere: userWhere,
      providerVotedWhere: userWhere,
      limit,
    },
    pollInterval: 1000 * 7, // 7s
  });

  return (
    <>
      <Loading hidden={!loading} />
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6">
        {data &&
          data.items.map((item) => <Item key={`ppi-${item.id}`} item={item} />)}
      </div>
      <div className="text-sm text-right mb-5 p-2 text-slate-600 hover:text-red-800">
        <Link href={'/search'}>&gt;&gt; ดูชุดข้อมูลทั้งหมด</Link>
      </div>
    </>
  );
}

const POPULAR_QUERY = gql`
  query POPULAR_QUERY(
    $limit: Int!
    $votedByWhere: dataset_points_bool_exp!
    $relatedVotedWhere: related_points_bool_exp!
    $providerVotedWhere: provider_points_bool_exp!
  ) {
    items: dataset(
      order_by: [
        { points_aggregate: { sum: { point: desc_nulls_last } } }
        { id: asc }
      ]
      limit: $limit
    ) {
      id
      name
      status
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
      points(order_by: [{ updated_at: desc }], limit: 1) {
        updated_at
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
