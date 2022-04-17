import { useEffect, useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import ThumbDown from '@/icons/ThumbDown';
import ThumbUp from '@/icons/ThumbUp';

import Modal from '../modal';
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
};

export default function VoteInline({ initialValue, datasetID }: VoteProps) {
  const timer = useRef(0);
  const { status: sessStatus } = useSession();
  const [upsertVote, { loading }] = useMutation(MUTATE_DATASET_POINTS);
  const [noActionAllowed, SetNoActionAllowed] = useState(true);
  const [noActMsg, SetNoActMessage] = useState('');
  const [Action, SetAction] = useState('-'); // 3 states: up, down, -
  const [Point, SetPoint] = useState(+initialValue.up + +initialValue.down);
  const [MyVote, SetMyVote] = useState(initialValue.mine);
  const [Hidden, SetHidden] = useState(true);

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
    if (sessStatus !== 'authenticated') {
      SetNoActMessage('โปรดเข้าสู่ระบบก่อน');
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
  }, [loading, sessStatus]);

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
      {!Hidden && (
        <Modal
          hidden={false}
          handleHidden={SetHidden}
          footer={
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                SetHidden(true);
              }}
            >
              Close
            </button>
          }
          content={
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* <!-- Heroicon name: outline/exclamation --> */}
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {noActMsg}
                </h3>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    คุณจำเป็นจะต้องเข้าสู่ระบบก่อนจึงจะสามารถโหวต
                    หรือเพิ่มเติมข้อมูลได้
                  </div>
                  <Link href="/profile" passHref>
                    <div className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 cursor-pointer text-base text-white font-medium bg-emerald-500  focus:ring-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm hover:bg-emerald-400 ">
                      เข้าสู่ระบบ
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      )}
      <div className={`text-md text-gray-600 flex items-center`}>
        <span className={`font-mono text-xs ${noColor} pr-1`}>{Point}</span>
        <span
          className="px-1 pb-1 hover:bg-slate-200"
          title={wording.like}
          onClick={() => {
            if (noActionAllowed) {
              SetHidden(false);
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
            if (noActionAllowed) {
              SetHidden(false);
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
