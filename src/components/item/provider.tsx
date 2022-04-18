import { useState } from 'react';

import { gql } from '@apollo/client';
import { useSession } from 'next-auth/react';

import Modal from '../modal';
import ChildrenVoteInline from './children-vote-inline';
import ProviderForm from './providerForm';
import InteractiveStatusBar from './statusbar';

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

function ProviderItem({ organization }: ItemProps) {
  /*
    Check - is like upvote
    Stop - is like downvote, but if it's creator, then it's deletion,
            but that only allowed when there is no vote at all
  */
  const { id, name, vote_up: voteUp, vote_down: voteDown } = organization;
  const vUp = +voteUp.aggregate.sum.point || 0;
  const vDown = +voteDown.aggregate.sum.point || 0;
  const [PendingDeletion, SetPendingDeletion] = useState(false);
  if (PendingDeletion) {
    return <></>;
  }

  return (
    <div className="flex gap-2 items-center self-center mt-1">
      <div className="">
        ‣ {name}
        <ChildrenVoteInline
          initialPoints={vUp + vDown}
          id={id}
          parentType="provider"
          SetPendingDeletion={SetPendingDeletion}
          updateMutationQ={MUTATE_PROVIDER_POINTS}
          deleteMutationQ={MUTATE_PROVIDER_DELETION}
        />
        <InteractiveStatusBar parentID={id} parentType={'provider'} />
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
    $providerID: uuid!
  ) {
    upsert_points: insert_provider_points(
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
