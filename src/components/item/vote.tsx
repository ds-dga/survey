import { useEffect, useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
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
  const timer = useRef(0);
  const { status } = useSession();
  const [upsertVote, { loading }] = useMutation(MUTATE_DATASET_POINTS);
  const [noActionAllowed, SetNoActionAllowed] = useState(true);
  const [noActMsg, SetNoActMessage] = useState('');
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

  useEffect(() => {
    if (status !== 'authenticated') {
      SetNoActMessage('Please login first');
      SetNoActionAllowed(true);
      return;
    }
    if (loading) {
      SetNoActMessage('Processing');
      SetNoActionAllowed(true);
      return;
    }
    SetNoActionAllowed(false);
    SetNoActMessage('');
  }, [loading, status]);

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
      // console.log("verify[finally] ")
      SetNoActionAllowed(false);
      SetNoActMessage('');
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
      // console.log(` --> save ${action} by ${IP}`)
      // console.log(" --> mutation result", Point, result)
      // SetAction('-');
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
  return (
    <div className="text-2xl flex flex-col items-center text-gray-600">
      <div
        className={`${Action === 'up' ? 'text-green-500' : ''}`}
        onClick={() => {
          if (noActionAllowed) {
            alert(noActMsg);
            return;
          }
          calcVote(Action === 'up' ? '-' : 'up');
        }}
      >
        <ArrowUp fill={''} />
      </div>
      <div className={`text-center ${noColor}`}>{Point}</div>
      <div
        className={`${Action === 'down' ? 'text-rose-500' : ''}`}
        onClick={() => {
          if (noActionAllowed) {
            alert(noActMsg);
            return;
          }
          calcVote(Action === 'down' ? '-' : 'down');
        }}
      >
        <ArrowDown fill={''} />
      </div>
    </div>
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
