import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';

import Item from '.';

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
      {loading && <p>Loading ... </p>}
      <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-6 mb-20">
        {data &&
          data.items.map((item) => <Item key={`ppi-${item.id}`} item={item} />)}
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
