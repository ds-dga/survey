import { useEffect, useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

import Modal from '../modal';
import ChildrenVoteInline from './children-vote-inline';
import CommentList from './comment';
import CommentForm from './commentForm';
import ProviderForm from './providerForm';

type OrgProps = {
  id: string;
  name: string;
  points: string[];
  my_vote: any;
  vote_up: any;
  vote_down: any;
  created_by: string;
};
type ItemProps = {
  organization: OrgProps;
  SetHidden: Function;
};

type ProviderProps = {
  orgs: OrgProps[];
  datasetID: string;
};

function ProviderItem({ organization, SetHidden }: ItemProps) {
  /*
    Check - is like upvote
    Stop - is like downvote, but if it's creator, then it's deletion,
            but that only allowed when there is no vote at all
  */
  const timer = useRef(0);
  const [showComment, SetShowComment] = useState(false);
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
  const user = (session && session.user) || null;
  const uid = user ? user.uid : null;
  const hasVote =
    voteUp.aggregate.sum.point !== null ||
    voteDown.aggregate.sum.point !== null;

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
        // refetchQueries:[
        //   {query:}
        // ]
      });
      // console.log(` --> save ${action} by ${IP}`)
      // console.log(' --> mutation result', Point, result);
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

  return (
    <div className="flex gap-2 items-center self-center mt-1">
      <div className="">
        ‣ {name}
        <ChildrenVoteInline
          Point={Point}
          id={id}
          calcVote={calcVote}
          Action={Action}
          SetHidden={SetHidden}
          DeleteItem={DeleteProvider}
          delEnabled={delEnabled}
          SetPendingDeletion={SetPendingDeletion}
        />
        <CommentForm
          parentType={'provider'}
          parentID={id}
          hidden={!showComment}
        />
        <CommentList
          parentType={'provider'}
          parentID={id}
          hidden={!showComment}
          toggleVisibility={SetShowComment}
        />
      </div>
    </div>
  );
}

export default function Provider({ orgs, datasetID }: ProviderProps) {
  const [formVisible, SetFormVisible] = useState(false);
  const [Hidden, SetHidden] = useState(true);
  const { status: sessStatus } = useSession();
  console.log('[provider] ', orgs);
  return (
    <>
      {!Hidden && <Modal hidden={false} handleHidden={SetHidden} />}
      <div
        className="text-gray-600 italic hover:bg-green-200 cursor-pointer"
        onClick={() => {
          if (sessStatus === 'authenticated') {
            SetFormVisible(!formVisible);
          } else {
            SetHidden(false);
          }
        }}
      >
        อยากได้ข้อมูลจากหน่วยงาน...
        <svg
          viewBox="0 0 32 32"
          className="inline mx-1 h-4 w-4 fill-slate-600 hover:fill-emerald-600"
        >
          <g data-name="plus android app aplication phone">
            <path d="M16 31a15 15 0 1 1 15-15 15 15 0 0 1-15 15zm0-28a13 13 0 1 0 13 13A13 13 0 0 0 16 3z" />
            <path d="M17 24h-2a2 2 0 0 1-2-2v-3h-3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h3v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3v3a2 2 0 0 1-2 2zm-7-9v2h4a1 1 0 0 1 1 1v4h2v-4a1 1 0 0 1 1-1h4v-2h-4a1 1 0 0 1-1-1v-4h-2v4a1 1 0 0 1-1 1z" />
          </g>
        </svg>
      </div>
      {orgs.length === 0 && (
        <p className="text-sm text-gray-500 italic">ยังไม่มีข้อมูล</p>
      )}
      {orgs.map((org: any, ind: number) => (
        <ProviderItem
          key={`${datasetID}-org-${ind}`}
          organization={org}
          SetHidden={SetHidden}
        />
      ))}

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
