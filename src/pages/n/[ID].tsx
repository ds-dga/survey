import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Item from '@/components/item';
import Loading from '@/components/loading';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function DatasetOne() {
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
  const { data, loading, error } = useQuery(DATASET_ONE_QUERY, {
    variables: {
      ID: router.query.ID,
      votedByWhere: userWhere,
      relatedVotedWhere: userWhere,
      providerVotedWhere: userWhere,
    },
    pollInterval: 1000 * 7, // 7s
  });

  const title = data ? data.item.name : 'ชุดข้อมูล';
  return (
    <Main
      meta={
        <Meta title={`Dataset: ${title}`} description="Open data category" />
      }
    >
      <div className="container mx-auto">
        <div className="m-3">
          <div className="flex flex-row items-center">
            <img className={`h-10`} src={`/assets/logo/digi.png`} alt="DIGI" />
            <div className="text-slate-600 text-2xl font-normal flex-1 text-center">
              ชุดข้อมูล
            </div>
          </div>
          <Loading hidden={!loading} />
          {error && <p>{error.message} ... </p>}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 mb-20">
            {data && (
              <Item
                key={`ct-${data.item.id}`}
                item={data.item}
                commentTotal={data.dataset_comments_total}
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}

const DATASET_ONE_QUERY = gql`
  query DATASET_ONE_QUERY(
    $ID: uuid!
    $votedByWhere: dataset_points_bool_exp!
    $relatedVotedWhere: related_points_bool_exp!
    $providerVotedWhere: provider_points_bool_exp!
  ) {
    item: dataset_by_pk(id: $ID) {
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
    dataset_comments_total: comments_aggregate(
      where: { parent_id: { _eq: $ID }, parent_type: { _eq: dataset } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
