import { useEffect, useRef, useState } from 'react';

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
  const [Action, SetAction] = useState('-'); // 3 states: up, down, -
  const [Point, SetPoint] = useState(+initialValue.up + +initialValue.down);
  const [MyVote, SetMyVote] = useState(initialValue.mine);

  useEffect(() => {
    if (initialValue.mine < 0) {
      SetAction('down');
    } else if (initialValue.mine === 0) {
      SetAction('-');
    } else {
      SetAction('up');
    }
  }, [initialValue]);

  function verifyIfrecorded(currScore, votingPoint, mutationResult) {
    let latestPoint = currScore;
    try {
      const {
        insert_dataset_points: { returning },
      } = mutationResult.data;
      const confirmObj = returning[0];
      latestPoint = confirmObj.dataset.points_aggregate.aggregate.sum.point;
      const votedPoint = confirmObj.point;
      if (votedPoint !== votingPoint) {
        alert('Err: your vote does not count');
        // setPoint(confirmObj.point)
      }
    } catch (e) {
      // console.log("verify[err] ", e)
    } finally {
      SetPoint(latestPoint);
      SetHideNoAuth(true);
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
      verifyIfrecorded(Point, ownVal, result);
    }, 2000);
  }

  function calcVote(action) {
    let currValue = Point;
    switch (action) {
      case 'up':
        currValue = currValue + 1 + (MyVote === -1 ? 1 : 0);
        SetMyVote(1);
        break;
      case 'down':
        currValue = currValue - 1 - (MyVote === 1 ? 1 : 0);
        SetMyVote(-1);
        break;
      default:
        if (MyVote > 0) {
          currValue -= 1;
        } else if (MyVote < 0) {
          currValue += 1;
        }
        SetMyVote(0);
    }
    SetPoint(currValue);
    SetAction(action);
    saveVote(action);
  }
  let noColor = '';
  if (Action === 'up') {
    noColor = 'text-green-500';
  } else if (Action === 'down') {
    noColor = 'text-rose-500';
  }
  /* Provider vote only applied to govOfficer #### >>> */
  return (
    <span className="inline">
      <div className={`text-md text-gray-600 flex items-center`}>
        <span className={`font-mono text-xs ${noColor} pr-1`}>{Point}</span>
        <span
          className="px-1 pb-1 hover:bg-slate-200"
          title={wording.like}
          onClick={() => {
            if (sessStatus !== 'authenticated') {
              SetHideNoAuth(false);
              // alert(noActMsg);
              return;
            }
            calcVote(Action === 'up' ? '-' : 'up');
          }}
        >
          <ThumbUp
            className="inline"
            fill={MyVote > 0 ? `#10b981` : '#9CA3AF'}
          />
        </span>
        <span
          className="px-1 pb-1 hover:bg-slate-200"
          title={wording.unlike}
          onClick={async () => {
            if (sessStatus !== 'authenticated') {
              SetHideNoAuth(false);
              return;
            }
            calcVote(Action === 'down' ? '-' : 'down');
          }}
        >
          <ThumbDown
            className="inline"
            fill={MyVote < 0 ? `#fb7185` : '#9CA3AF'}
          />
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
