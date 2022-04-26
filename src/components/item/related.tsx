import { useState } from 'react';

import { gql } from '@apollo/client';
import { useSession } from 'next-auth/react';

import Modal from '../modal';
import RelatedForm from './relatedForm';
import InteractiveStatusBar from './statusbar';

type RelatedItemProps = {
  id: string;
  maintainer: string;
  url: string;
  title: string;
  points: string[];
  my_vote: any;
  vote_up: any;
  vote_down: any;
  created_by: string;
};
type ItemProps = {
  item: RelatedItemProps;
  SetHidden: Function;
  datasetID: string;
};

type RelatedProps = {
  items: RelatedItemProps[];
  datasetID: string;
};

function RelatedItem({ item, datasetID }: ItemProps) {
  /*
    Check - is like upvote
    Stop - is like downvote, but if it's creator, then it's deletion,
            but that only allowed when there is no vote at all
  */
  const {
    id,
    maintainer,
    title,
    url,
    // created_by: createdBy,
    my_vote: myVote,
    vote_up: voteUp,
    vote_down: voteDown,
  } = item;
  const vUp = +voteUp.aggregate.sum.point || 0;
  const vDown = +voteDown.aggregate.sum.point || 0;
  const [PendingDeletion, SetPendingDeletion] = useState(false);

  if (PendingDeletion) {
    return <></>;
  }

  return (
    <div className="flex gap-2 items-center self-center mt-1">
      <div className="">
        <a href={`${url}`} target="_blank" rel="noreferrer">
          ‣ {title}
        </a>
        <div className={`text-xs text-gray-600 ml-3`}>
          {maintainer ? `โดย ${maintainer}` : ''}
        </div>
        <InteractiveStatusBar
          datasetID={datasetID}
          parentID={id}
          parentType={'related'}
          myInitialPoint={myVote.length > 0 ? myVote[0].point : 0}
          initialPoints={vUp + vDown}
          SetPendingDeletion={SetPendingDeletion}
          updateMutationQ={MUTATE_RELATED_POINTS}
          deleteMutationQ={MUTATE_RELATED_DELETION}
          commentLabel={'ความเห็นต่อไฟล์หรือต่อหน่วยงานที่รับผิดชอบข้อมูล'}
        />
      </div>
    </div>
  );
}

export default function Related({ items, datasetID }: RelatedProps) {
  const [formVisible, SetFormVisible] = useState(false);
  const [Hidden, SetHidden] = useState(true);
  const { status: sessStatus } = useSession();

  // console.log('[related] items: ', items);
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
        ชุดข้อมูลภายใต้ชุดนี้ข้อมูลนี้
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

      {items.length === 0 && (
        <p className="text-sm text-gray-500 italic">ยังไม่มีข้อมูล</p>
      )}
      {items.map((item: any, ind: number) => (
        <RelatedItem
          key={`${datasetID}-org-${ind}`}
          datasetID={datasetID}
          item={item}
          SetHidden={SetHidden}
        />
      ))}
      <RelatedForm
        datasetID={datasetID}
        hidden={!formVisible}
        handleFormVisible={SetFormVisible}
      />
    </>
  );
}

const MUTATE_RELATED_DELETION = gql`
  mutation MUTATE_RELATED_DELETION($id: uuid!) {
    delete_dateset_related_by_pk(id: $id) {
      id
    }
  }
`;

const MUTATE_RELATED_POINTS = gql`
  mutation MUTATE_RELATED_POINTS($point: Int!, $day: date!, $relatedID: uuid!) {
    upsert_points: insert_related_points(
      objects: { point: $point, day: $day, related_id: $relatedID }
      on_conflict: {
        constraint: related_points_related_id_voted_by_key
        update_columns: [point]
      }
    ) {
      returning {
        point
        day
        related {
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
