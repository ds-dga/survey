import { useSession } from 'next-auth/react';

import ThumbDown from '@/icons/ThumbDown';
import ThumbUp from '@/icons/ThumbUp';

import { isGovOfficer } from '../../libs/govAccount';
import { wording } from './wording';

type VoteProps = {
  Point: Number;
  id: string;
  calcVote: Function;
  Action: string;
  SetHidden: Function;
  DeleteItem: Function;
  delEnabled: boolean;
  SetPendingDeletion: Function;
};

export default function ChildrenVoteInline({
  Point,
  id,
  Action,
  calcVote,
  SetHidden,
  DeleteItem,
  delEnabled,
  SetPendingDeletion,
}: VoteProps) {
  // const [Action, SetAction] = useState('-'); // 3 states: up, down, -
  const { data: session, status: sessStatus } = useSession();
  const user = (session && session.user) || null;
  const uid = user ? user.uid : null;

  let noColor = '';
  if (Action === 'up') {
    noColor = 'text-green-500';
  } else if (Action === 'down') {
    noColor = 'text-rose-500';
  }

  return (
    <>
      {/* Related vote only applied to govOfficer #### >>> */}
      {sessStatus !== 'loading' && isGovOfficer(user) && (
        <div className={`text-md text-gray-600 ml-3 flex items-center`}>
          <span className={`font-mono text-xs ${noColor} pr-1`}>{Point}</span>
          <span
            className="px-1 pb-1 hover:bg-slate-200"
            title={wording.like}
            onClick={() => {
              if (!uid) {
                SetHidden(false);
                return;
              }
              calcVote(Action === 'up' ? '-' : 'up');
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
                SetHidden(false);
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
                calcVote(Action === 'down' ? '-' : 'down');
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
