import { useSession } from 'next-auth/react';

import ArrowDown from '@/icons/ArrowDown';
import ArrowUp from '@/icons/ArrowUp';

type InitProps = {
  up: Number;
  mine: Number;
  down: Number;
  latest: string;
};
type VoteProps = {
  initialValue: InitProps;
  datasetID: string;
};

export default function Vote({ initialValue, datasetID }: VoteProps) {
  const { data: session, status } = useSession();
  // const [upsertVote, { loading }] = useMutation(MUTATE_DATASET_POINTS);
  const Action = initialValue.mine < 0 ? 'down' : 'up';
  const Point = +initialValue.up - +initialValue.down;

  console.log('vote: ', datasetID);
  console.log('session: ', status, session);
  return (
    <div className="text-2xl flex flex-col items-center text-gray-600">
      <div
        className={`${Action === 'up' ? 'up' : ''}`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "up" ? "-" : "up")
        }}
      >
        <ArrowUp fill={''} />
      </div>
      <div className={`text-center ${Action} `}>{Point}</div>
      <div
        className={`arrow down`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "down" ? "-" : "down")
        }}
      >
        <ArrowDown fill={''} />
      </div>
    </div>
  );
}

/* const MUTATE_DATASET_POINTS = gql`
  mutation MUTATE_DATASET_POINTS(
    $votedBy: String!
    $point: Int!
    $day: date!
    $datasetID: uuid!
  ) {
    insert_dataset_points(
      objects: {
        voted_by: $votedBy
        point: $point
        day: $day
        dataset_id: $datasetID
      }
      on_conflict: {
        constraint: dataset_points_dataset_id_voted_by_key
        update_columns: point
      }
    ) {
      returning {
        point
        day
        dataset {
          points_aggregate {
            aggregate {
              sum {
                point
              }
            }
          }
        }
      }
    }
  }
`;
 */
