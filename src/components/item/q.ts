import { gql } from '@apollo/client';

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
    dataset_comments_total: comments_aggregate(
      where: { parent_id: { _eq: $ID }, parent_type: { _eq: dataset } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export { DATASET_ONE_QUERY };
