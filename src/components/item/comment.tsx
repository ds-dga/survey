import { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';

import { displayDatetime } from '../../libs/day';
import UserProvider, { UserProviderType } from '../UserProvider';

type CommentProps = {
  parentType: string;
  parentID: string;
  toggleVisibility: Function;
  hidden: boolean;
};

type CommentItemProps = {
  user: UserProviderType;
  item: any;
};

function CommentItem({ user, item }: CommentItemProps) {
  const color =
    user.id === item.user.id
      ? '#FDA4AF' // sky-500
      : '#7DD3FC'; // bg-sky-300
  // NEVER show item if it's hidden, but its own user and user is mod
  if (item.hidden && user.id !== item.user.id && user.role !== 'mod') {
    return <></>;
  }
  return (
    <div className="flex flex-col sm:flex-row">
      <div className="pt-4 mr-4 text-sm min-w-fit">
        👤 {item.user.name}
        <br />⏰{' '}
        <span className="italic text-xs">
          {displayDatetime(item.created_at)}
        </span>
      </div>
      <TalkBubble
        className={`my-2 px-5 py-3 border-0 rounded-lg`}
        bgColor={color}
      >
        {/* <div className="text-sm text-sky-900">
          ⏰ <span className="italic">{displayDatetime(item.created_at)}</span>
        </div> */}
        {item.note}
      </TalkBubble>
    </div>
  );
}

export default function CommentList({
  parentID,
  parentType,
  hidden,
}: CommentProps) {
  const user = UserProvider();
  const [Items, SetItems] = useState([]);
  const { data } = useQuery(COMMENT_QUERY, {
    variables: {
      parentType,
      parentID,
    },
    pollInterval: 1000 * 20, // 15-sec
    skip: hidden || user.loading,
  });

  useEffect(() => {
    if (!data) {
      SetItems([]);
      return;
    }
    SetItems(data.comments);
  }, [data]);

  if (hidden) {
    return <></>;
  }

  return (
    <>
      {Items.length === 0 && (
        <p className="text-sm text-gray-500 italic">~ ยังไม่มีความคิดเห็น ~</p>
      )}
      {Items.map((cm: any, ind: number) => (
        <CommentItem user={user} key={`cm-${ind}`} item={cm} />
      ))}
    </>
  );
}

// talk-bubble tri-right left-in
const TalkBubble = styled.div`
  display: inline-block;
  position: relative;
  /* width: 200px; */
  min-height: 3rem;
  height: auto;
  background-color: ${(props) => (props.bgColor ? props.bgColor : '#7dd3fc')};

  :after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: -20px;
    right: auto;
    top: 1.2rem;
    bottom: auto;
    border: 12px solid;
    border-color: ${(props) =>
      props.bgColor
        ? `${props.bgColor} ${props.bgColor} transparent transparent`
        : '#7dd3fc #7dd3fc transparent transparent'};
  }
`;

export const COMMENT_QUERY = gql`
  query COMMENT_QUERY(
    $parentType: comment_parent_type_enum!
    $parentID: uuid!
  ) {
    comments(
      where: {
        parent_id: { _eq: $parentID }
        parent_type: { _eq: $parentType }
      }
      order_by: [{ created_at: desc }]
    ) {
      note
      created_at

      user {
        id
        name
      }
    }
  }
`;
