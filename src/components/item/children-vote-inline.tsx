import { useRef, useState } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import ThumbDown from '@/icons/ThumbDown';
import ThumbUp from '@/icons/ThumbUp';

import { isGovOfficer } from '../../libs/govAccount';
import { wording } from './wording';

type VoteProps = {
  myInitialPoint?: number;
  initialPoints: number;
  id: string;
  parentType: string;
  // calcVote: Function;
  // Action: string;
  // SetHidden: Function;
  // DeleteItem: Function;
  // delEnabled: boolean;
  SetPendingDeletion: Function;
  updateMutationQ: DocumentNode;
  deleteMutationQ: DocumentNode;
};

export default function ChildrenVoteInline({
  id,
  parentType,
  initialPoints,
  myInitialPoint,
  SetPendingDeletion,
  updateMutationQ,
  deleteMutationQ,
}: VoteProps) {
  const timer = useRef(0);
  const [Point, SetPoint] = useState(initialPoints);
  const [Action, SetAction] = useState(Vote2Action(myInitialPoint)); // 3 states: up, down, -
  const [MyVote, SetMyVote] = useState(myInitialPoint || 0);
  const [UpsertItem] = useMutation(updateMutationQ);
  const [DeleteItem] = useMutation(deleteMutationQ);
  const { data: session, status: sessStatus } = useSession();
  const user = (session && session.user) || null;
  const uid = user ? user.uid : null;

  function saveVote(point: number) {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      // update vote to timer
      const today = dayjs().format('YYYY-MM-DD');
      let variables;
      if (parentType === 'provider') {
        variables = {
          point,
          day: today,
          providerID: id,
        };
      } else if (parentType === 'related') {
        variables = {
          point,
          day: today,
          relatedID: id,
        };
      }
      if (!variables.day) return;

      const result = await UpsertItem({
        variables,
      });
      // console.log(` --> save ${action} by ${IP}`)
      // console.log(' --> mutation result', Point, result);
      const { success, message } = verifyIfrecorded(Point, point, result);
      // console.log('[vote-inline]', success, message);
      if (success) {
        SetPoint(+(message as string));
      } else {
        alert(message);
      }
    }, 2000);
  }

  let noColor = '';
  if (Action === 'up') {
    noColor = 'text-green-500';
  } else if (Action === 'down') {
    noColor = 'text-rose-500';
  }

  const delEnabled = !uid;

  return (
    <>
      {/* Related vote only applied to govOfficer #### >>> */}
      {sessStatus !== 'loading' && isGovOfficer(user) && (
        <div className={`text-md text-gray-600 flex items-center`}>
          <span className={`font-mono text-xs ${noColor} pr-1`}>{Point}</span>
          <span
            className="px-1 pb-1 hover:bg-slate-200"
            title={wording.like}
            onClick={() => {
              if (!uid) {
                // SetHidden(false);
                alert('login first!');
                return;
              }
              const action = Action === 'up' ? '-' : 'up';
              const currPnt = calcVote(Point, MyVote, action);

              SetPoint(currPnt);
              SetAction(action);
              const myV = action === 'up' ? 1 : 0;
              saveVote(myV);
              SetMyVote(myV);
            }}
          >
            <ThumbUp
              className="inline"
              fill={Action === 'up' ? `#10b981` : '#9CA3AF'}
            />
          </span>
          <span
            className="px-1 pb-1 hover:bg-slate-200"
            title={wording.unlike}
            onClick={async () => {
              if (!uid) {
                // SetHidden(false);
                alert('login first!');
                return;
              }
              if (delEnabled) {
                if (!window.confirm('คุณต้องการจะข้อมูลนี้ ใช่หรือไม่?'))
                  return;
                const r = await DeleteItem({
                  variables: {
                    id,
                  },
                });
                if (r.data && r.data.delete_dataset_related_by_pk) {
                  SetPendingDeletion(true);
                }
              } else {
                const action = Action === 'down' ? '-' : 'down';
                const currPnt = calcVote(Point, MyVote, action);

                SetPoint(currPnt);
                SetAction(action);
                const myV = action === 'down' ? -1 : 0;
                saveVote(myV);
                SetMyVote(myV);
              }
            }}
          >
            <ThumbDown
              className="inline"
              fill={Action === 'down' ? `#fb7185` : '#9CA3AF'}
            />
          </span>
        </div>
      )}
      {/* << #### END of Related vote only applied to govOfficer */}
    </>
  );
}

function verifyIfrecorded(currScore, votingPoint, mutationResult) {
  let latestPoint = currScore;
  try {
    const {
      upsert_points: { returning },
    } = mutationResult.data;
    const confirmObj = returning[0];
    const xx = confirmObj.related ? confirmObj.related : confirmObj.provider;
    latestPoint = xx.points_aggregate.aggregate.sum.point;
    const votedPoint = confirmObj.point;
    if (votedPoint !== votingPoint) {
      return { success: false, message: 'Err: your vote does not count' };
      // alert('Err: your vote does not count');
      // setPoint(confirmObj.point)
    }
    return { success: true, message: `${latestPoint}` };
  } catch (e) {
    // console.log("verify[err] ", e)
    return { success: false, message: e };
  }
}

function calcVote(initPoint, initVote, action) {
  let currValue = initPoint;
  switch (action) {
    case 'up':
      currValue = currValue + 1 + (initVote === -1 ? 1 : 0);
      break;
    case 'down':
      currValue = currValue - 1 - (initVote === 1 ? 1 : 0);
      break;
    default:
      if (initVote > 0) {
        currValue -= 1;
      } else if (initVote < 0) {
        currValue += 1;
      }
  }
  return currValue;
}

function Vote2Action(v) {
  if (v === 1) return 'up';
  if (v === -1) return 'down';
  return '-';
}
