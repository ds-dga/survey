import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import Item from '@/components/item';
import Loading from '@/components/loading';
import UserProvider from '@/components/UserProvider';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function CategoryOne() {
  const router = useRouter();
  const user = UserProvider();
  let userWhere = {};
  let wh: any = {
    _and: [
      {
        category: {
          id: { _eq: router.query.categoryID },
        },
      },
      { _or: [{ status: { _neq: 'hidden' } }, { status: { _is_null: true } }] },
    ],
  };
  if (user.role === 'mod') {
    wh = {
      category: {
        id: { _eq: router.query.categoryID },
      },
    };
  }
  if (user.id) {
    userWhere = {
      voted_by: {
        _eq: user.id,
      },
    };
  }
  const { data, loading, error } = useQuery(CATEGORY_ITEMS_QUERY, {
    variables: {
      votedByWhere: userWhere,
      relatedVotedWhere: userWhere,
      providerVotedWhere: userWhere,
      categoryID: router.query.categoryID,
      where: wh,
    },
    pollInterval: 1000 * 20, // 7s
  });

  const cat = data ? data.category[0] : null;
  const title = cat?.name || 'Category';
  return (
    <Main
      meta={
        <Meta title={`Dataset: ${title}`} description="Open data category" />
      }
    >
      <div className="container mx-auto">
        <Loading hidden={!loading} />
        <div className="m-5">
          {error && <p>{error.message} ... </p>}
          <div className="text-slate-600 text-2xl font-normal flex gap-2 align-baseline">
            {cat && (
              <img
                className="w-12 h-12 mx-0 mr-1 md:mx-2 md:mr-2"
                src={cat.image}
                alt={cat.name}
              />
            )}
            {cat?.name || 'กลุ่มชุดข้อมูล'}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 mb-20">
            {data &&
              data.items.map((item) => (
                <Item key={`ct-${item.id}`} item={item} />
              ))}
          </div>
        </div>
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
    category: dataset_category(where: { id: { _eq: $categoryID } }) {
      name
      image
    }
  }
`;
