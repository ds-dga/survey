import { useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import ThumbDown from '@/icons/ThumbDown';
import ThumbUp from '@/icons/ThumbUp';

import { wording } from './wording';

type InitProps = {
  up: Number;
  mine: Number;
  down: Number;
  latest: string;
};
type VoteProps = {
  initialValue: InitProps;
  datasetID: string;
  noAuthHidden: boolean;
  SetHideNoAuth: Function;
};

export default function VoteInline({
  initialValue,
  datasetID,
  SetHideNoAuth,
}: VoteProps) {
  const timer = useRef(0);
  const { status: sessStatus } = useSession();
  const [upsertVote] = useMutation(MUTATE_DATASET_POINTS);
  const [MyPoint, SetMyPoint] = useState(+initialValue.mine);
  const init = initialValue;

  function verifyMutation(mutationResult) {
    try {
      const {
        insert_dataset_points: { returning },
      } = mutationResult.data;
      const confirmObj = returning[0];
      SetMyPoint(confirmObj.point);
    } catch (e) {
      // console.log("verify[err] ", e)
    }
  }

  function saveVote(action: string) {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      // update vote to timer
      const today = dayjs().format('YYYY-MM-DD');
      let ownVal = 0;
      switch (action) {
        case 'up':
          ownVal = 1;
          break;
        case 'down':
          ownVal = -1;
          break;
        default:
          break;
      }
      const result = await upsertVote({
        variables: {
          point: ownVal,
          day: today,
          datasetID,
        },
      });
      verifyMutation(result);
    }, 2000);
  }

  /* Provider vote only applied to govOfficer #### >>> */
  return (
    <span className="inline">
      <div className={`text-md text-gray-600 flex items-center`}>
        <span
          className={`flex items-center font-mono text-xs ${
            MyPoint > 0 ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          {+init.up !== 0 && init.up}
          <span
            className="px-1 pb-1 hover:bg-slate-200"
            title={wording.like}
            onClick={() => {
              if (sessStatus !== 'authenticated') {
                SetHideNoAuth(false);
                // alert(noActMsg);
                return;
              }
              saveVote(MyPoint > 0 ? '-' : 'up');
              // calcVote(Action === 'up' ? '-' : 'up');
            }}
          >
            <ThumbUp
              className="inline"
              fill={MyPoint > 0 ? `#10b981` : '#9CA3AF'}
            />
          </span>
        </span>
        <span
          className={`flex items-center font-mono text-xs ${
            MyPoint < 0 ? 'text-rose-500' : 'text-gray-500'
          }`}
        >
          {+init.down !== 0 && Math.abs(+init.down)}
          <span
            className="px-1 pb-1 hover:bg-slate-200"
            title={wording.unlike}
            onClick={async () => {
              if (sessStatus !== 'authenticated') {
                SetHideNoAuth(false);
                return;
              }
              saveVote(MyPoint < 0 ? '-' : 'down');
              // calcVote(Action === 'down' ? '-' : 'down');
            }}
          >
            <ThumbDown
              className="inline"
              fill={MyPoint < 0 ? `#fb7185` : '#9CA3AF'}
            />
          </span>
        </span>
      </div>
    </span>
  );
}

const MUTATE_DATASET_POINTS = gql`
  mutation MUTATE_DATASET_POINTS($point: Int!, $day: date!, $datasetID: uuid!) {
    insert_dataset_points(
      objects: { point: $point, day: $day, dataset_id: $datasetID }
      on_conflict: {
        constraint: dataset_points_dataset_id_voted_by_key
        update_columns: [point]
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
