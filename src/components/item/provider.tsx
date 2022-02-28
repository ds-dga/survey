import { useEffect, useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import Check from '@/icons/Check';
import Stop from '@/icons/Stop';

import ProviderForm from './providerForm';

type OrgProps = {
  id: Number;
  name: String;
  points: String[];
  my_vote: any;
  vote_up: any;
  vote_down: any;
  created_by: String;
};
type ItemProps = {
  organization: OrgProps;
};

type ProviderProps = {
  orgs: OrgProps[];
  datasetID: string;
};

function ProviderItem({ organization }: ItemProps) {
  /*
    Check - is like upvote
    Stop - is like downvote, but if it's creator, then it's deletion,
            but that only allowed when there is no vote at all
  */
  const timer = useRef(0);
  const {
    id,
    name,
    my_vote: myVote,
    created_by: createdBy,
    vote_up: voteUp,
    vote_down: voteDown,
  } = organization;
  const { data: session } = useSession();
  const [UpsertVote] = useMutation(MUTATE_PROVIDER_POINTS);
  const [DeleteProvider] = useMutation(MUTATE_PROVIDER_DELETION);
  const vUp = +voteUp.aggregate.sum.point || 0;
  const vDown = +voteDown.aggregate.sum.point || 0;
  const [Point, SetPoint] = useState(vUp + vDown);
  const [MyVote, SetMyVote] = useState(myVote.length > 0 ? myVote[0].point : 0);
  const [Action, SetAction] = useState('-'); // 3 states: up, down, -
  const [PendingDeletion, SetPendingDeletion] = useState(false);
  const uid = session && session.user ? session.user.uid : null;
  const hasVote =
    voteUp.aggregate.sum.point !== null ||
    voteDown.aggregate.sum.point !== null;
  console.log('hasVote :', hasVote, voteUp, voteDown);

  const delEnabled = !hasVote && uid === createdBy;

  useEffect(() => {
    if (myVote.length > 0) {
      const pnt = myVote[0].point;
      let act = '-';
      if (pnt > 0) {
        act = 'up';
      } else if (pnt < 0) {
        act = 'down';
      }
      SetAction(act);
    }
  }, [myVote]);

  function verifyIfrecorded(currScore, votingPoint, mutationResult) {
    let latestPoint = currScore;
    try {
      const {
        insert_provider_points: { returning },
      } = mutationResult.data;
      const confirmObj = returning[0];
      latestPoint = confirmObj.provider.points_aggregate.aggregate.sum.point;
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
      const result = await UpsertVote({
        variables: {
          point: ownVal,
          day: today,
          providerID: id,
        },
      });
      // console.log(` --> save ${action} by ${IP}`)
      console.log(' --> mutation result', Point, result);
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

  if (PendingDeletion) {
    return <></>;
  }
  let noColor = '';
  if (Action === 'up') {
    noColor = 'text-green-500';
  } else if (Action === 'down') {
    noColor = 'text-rose-500';
  }
  return (
    <div className="flex gap-2 items-center self-center mt-1">
      <div className="text-l min-w-fit text-gray-500 grid grid-cols-3 gap-1 items-center self-center content-center">
        <div className={`font-mono text-xs text-right ${noColor}`}>
          {Point !== 0 ? Point : ''}
        </div>
        <span
          className="px-1 pb-1 hover:bg-slate-200"
          onClick={() => {
            calcVote(Action === 'up' ? '-' : 'up');
          }}
        >
          <Check className="inline" fill={'#10b981'} />
        </span>
        <span
          className="px-1 pb-1 hover:bg-slate-200"
          onClick={async () => {
            if (delEnabled) {
              if (!window.confirm('คุณต้องการจะลบหน่วยงานนี้ ใช่หรือไม่?'))
                return;
              const r = await DeleteProvider({
                variables: {
                  id,
                },
              });
              if (r.data && r.data.delete_dataset_provider_by_pk) {
                SetPendingDeletion(true);
              }
            } else {
              calcVote(Action === 'down' ? '-' : 'down');
            }
          }}
        >
          <Stop className="inline" fill={'#fb7185'} />
        </span>
      </div>
      <div className="">{name}</div>
    </div>
  );
}

export default function Provider({ orgs, datasetID }: ProviderProps) {
  const [formVisible, SetFormVisible] = useState(false);
  const { status: sessStatus } = useSession();

  return (
    <>
      <div className="text-gray-600 italic">
        {orgs.length
          ? 'หน่วยงานที่เปิดเผยข้อมูล'
          : 'ยังไม่มีข้อมูลหน่วยงานที่เปิดเผยข้อมูล'}
      </div>
      {orgs.map((org: any, ind: number) => (
        <ProviderItem key={`${datasetID}-org-${ind}`} organization={org} />
      ))}
      <button
        type="button"
        className={`mt-3 px-4 py-1 text-sm rounded-full  hover:border-transparent focus:outline-none hover:scale-105 ease-in-out duration-300 ${
          formVisible
            ? 'focus:ring-teal-900 bg-fuchsia-700 hover:bg-fuchsia-900 text-white hover:text-white'
            : 'focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-400 text-white hover:text-white'
        }`}
        onClick={() => {
          if (sessStatus === 'authenticated') {
            SetFormVisible(!formVisible);
          } else {
            alert('โปรดเข้าสู่ระบบก่อน');
          }
        }}
      >
        {formVisible
          ? 'ยกเลิกการเพิ่มหน่วยงาน'
          : 'เพิ่มหน่วยงานที่อยากให้เปิดข้อมูล'}
      </button>

      <ProviderForm
        datasetID={datasetID}
        hidden={!formVisible}
        handleFormVisible={SetFormVisible}
      />
    </>
  );
}

const MUTATE_PROVIDER_DELETION = gql`
  mutation MUTATE_PROVIDER_DELETION($id: Int!) {
    delete_dataset_provider_by_pk(id: $id) {
      id
    }
  }
`;

const MUTATE_PROVIDER_POINTS = gql`
  mutation MUTATE_PROVIDER_POINTS(
    $point: Int!
    $day: date!
    $providerID: Int!
  ) {
    insert_provider_points(
      objects: { point: $point, day: $day, provider_id: $providerID }
      on_conflict: {
        constraint: provider_points_provider_id_voted_by_key
        update_columns: [point]
      }
    ) {
      returning {
        point
        day
        provider {
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
