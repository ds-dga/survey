import { MutableRefObject, useRef, useState } from 'react';

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

  let currUp = +init.up || 0;
  let currDown = +init.down || 0;
  if (MyPoint !== +init.mine) {
    if (+init.mine > 0) {
      currUp -= 1;
    } else if (+init.mine < 0) {
      currDown += 1;
    }
    if (MyPoint > 0) {
      currUp += 1;
    } else if (MyPoint < 0) {
      currDown -= 1;
    }
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
          {+currUp !== 0 && currUp}
          <span
            className="cursor-pointer px-1 pb-1 hover:bg-slate-200"
            title={wording.like}
            onClick={() => {
              if (sessStatus !== 'authenticated') {
                SetHideNoAuth(false);
                // alert(noActMsg);
                return;
              }
              const act = MyPoint > 0 ? '-' : 'up';
              const idObj = { datasetID };
              handleVoteChange(act, upsertVote, SetMyPoint, idObj, timer);
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
          {+currDown !== 0 && Math.abs(+currDown)}
          <span
            className="cursor-pointer px-1 pb-1 hover:bg-slate-200"
            title={wording.unlike}
            onClick={async () => {
              if (sessStatus !== 'authenticated') {
                SetHideNoAuth(false);
                return;
              }
              clearTimeout(timer.current);

              const act = MyPoint < 0 ? '-' : 'down';
              const idObj = { datasetID };
              handleVoteChange(act, upsertVote, SetMyPoint, idObj, timer);
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

export function handleVoteChange(
  action: string,
  mutate: Function,
  setOwnPoint: Function,
  idObj: object,
  timer: MutableRefObject<number>
) {
  clearTimeout(timer.current);
  // eslint-disable-next-line no-param-reassign
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
    const result = await mutate({
      variables: {
        point: ownVal,
        day: today,
        ...idObj,
      },
    });
    try {
      const {
        insert_dataset_points: { returning },
      } = result.data;
      const confirmObj = returning[0];
      setOwnPoint(confirmObj.point);
    } catch (e) {
      // console.log("verify[err] ", e)
    }
  }, 2000);
}
