import { useEffect, useRef, useState } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';

import ChatBubble from '@/icons/ChatBubble';

import CommentList from './comment';
import CommentForm from './commentForm';

type StatusBarProps = {
  parentType: string;
  parentID: string;
  // toggleVisibility: Function;
  // hidden: boolean;
};

export default function InteractiveStatusBar({
  parentType,
  parentID,
}: StatusBarProps) {
  const timer = useRef(0);
  const [showComment, SetShowComment] = useState(false);
  const { status: sessStatus } = useSession();
  const [execQuery, { data }] = useLazyQuery(STATUS_COMPONENT_QUERY);

  useEffect(() => {
    if (sessStatus !== 'loading' && parentType && parentID) {
      const vars = {
        parentType,
        parentID,
      };
      execQuery({
        variables: vars,
      });

      clearInterval(timer.current);
      timer.current = window.setInterval(async () => {
        execQuery({
          variables: vars,
        });
      }, 1000 * 15);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [sessStatus, execQuery, parentID, parentType]);

  const talkTotal = data ? data.commentTotal.aggregate.count : 0;

  return (
    <div className="px-3">
      <button
        className="text-sm font-medium text-sky-500"
        onClick={() => {
          SetShowComment(!showComment);
        }}
      >
        {talkTotal} ความเห็น <ChatBubble className="inline text-xl" />
      </button>

      <CommentForm
        parentType={parentType}
        parentID={parentID}
        hidden={!showComment}
      />
      <CommentList
        parentType={parentType}
        parentID={parentID}
        hidden={!showComment}
        toggleVisibility={SetShowComment}
      />
    </div>
  );
}

export const STATUS_COMPONENT_QUERY = gql`
  query STATUS_COMPONENT_QUERY(
    $parentType: comment_parent_type_enum!
    $parentID: uuid!
  ) {
    commentTotal: comments_aggregate(
      where: {
        parent_id: { _eq: $parentID }
        parent_type: { _eq: $parentType }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
