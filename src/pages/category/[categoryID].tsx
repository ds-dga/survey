import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Item from '@/components/item';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function CategoryOne() {
  const { data: session } = useSession();
  let userWhere = {};
  if (session) {
    userWhere = {
      voted_by: {
        _eq: session.user.uid,
      },
    };
  }
  const router = useRouter();
  const { data, loading, error } = useQuery(CATEGORY_ITEMS_QUERY, {
    variables: {
      votedByWhere: userWhere,
      relatedVotedWhere: userWhere,
      providerVotedWhere: userWhere,
      categoryID: router.query.categoryID,
      where: {
        category: {
          id: { _eq: router.query.categoryID },
        },
      },
    },
    pollInterval: 1000 * 7, // 7s
  });

  const title = data ? data.category[0].name : 'Category';
  return (
    <Main
      meta={
        <Meta title={`Dataset: ${title}`} description="Open data category" />
      }
    >
      {loading && <p>Loading ... </p>}
      {error && <p>{error.message} ... </p>}
      <div className="text-slate-600 text-2xl font-normal">
        {data ? data.category[0].name : 'Category'}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 mb-20">
        {data &&
          data.items.map((item) => <Item key={`ct-${item.id}`} item={item} />)}
      </div>
    </Main>
  );
}

const CATEGORY_ITEMS_QUERY = gql`
  query CATEGORY_ITEMS_QUERY(
    $categoryID: Int!
    $where: dataset_bool_exp!
    $votedByWhere: dataset_points_bool_exp!
    $relatedVotedWhere: related_points_bool_exp!
    $providerVotedWhere: provider_points_bool_exp!
  ) {
    items: dataset(
      where: $where
      order_by: [
        { points_aggregate: { sum: { point: desc_nulls_last } } }
        { id: asc }
      ]
    ) {
      id
      name
      category {
        name
      }
      my_vote: points(where: $votedByWhere) {
        point
      }
      related {
        id
        maintainer
        title
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
    category: dataset_category(where: { id: { _eq: $categoryID } }) {
      name
    }
  }
`;
