import { useEffect, useRef, useState } from 'react';

import { DocumentNode, gql, useLazyQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { NextRouter, useRouter } from 'next/router';

import ChatBubble from '@/icons/ChatBubble';
import { extractHashRoute } from '@/libs/route';

import { isGovOfficer } from '../../libs/govAccount';
import ChildrenVoteInline from './children-vote-inline';
import CommentList from './comment';
import CommentForm from './commentForm';

type StatusBarProps = {
  datasetID: string;
  parentType: string;
  parentID: string;
  initialPoints?: number;
  myInitialPoint?: number;
  SetPendingDeletion?: Function;
  updateMutationQ?: DocumentNode;
  deleteMutationQ?: DocumentNode;
  commentHidden?: boolean;
  commentLabel?: string;
};

export default function InteractiveStatusBar({
  datasetID,
  parentType,
  parentID,
  initialPoints,
  myInitialPoint,
  SetPendingDeletion,
  updateMutationQ,
  deleteMutationQ,
  commentLabel,
  commentHidden,
}: StatusBarProps) {
  const timer = useRef(0);
  const commentRef = useRef(null);
  const router = useRouter();
  const isDetailPage = router.route === '/n/[ID]';
  const [showComment, SetShowComment] = useState(
    shouldShowCommment(parentType, parentID, router)
  );
  const { data: session, status: sessStatus } = useSession();
  const [execQuery, { data }] = useLazyQuery(STATUS_COMPONENT_QUERY);

  useEffect(() => {
    if (shouldShowCommment(parentType, parentID, router)) {
      setTimeout(() => {
        window.scrollTo({
          behavior: commentRef?.current ? 'smooth' : 'auto',
          top: commentRef?.current
            ? (commentRef?.current as HTMLElement).offsetTop
            : 0,
        });
      }, 500);
    }
  }, [parentID, parentType, router]);

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
  const hasInlineVote =
    isGovOfficer(session?.user) &&
    initialPoints !== undefined &&
    SetPendingDeletion !== undefined &&
    updateMutationQ !== undefined &&
    deleteMutationQ !== undefined;

  // console.log('[statusbar] ', commentHidden, commentLabel);
  return (
    <>
      <div className="px-3 flex ">
        {hasInlineVote && (
          <ChildrenVoteInline
            id={parentID}
            parentType={parentType}
            initialPoints={initialPoints}
            myInitialPoint={myInitialPoint || 0} // optional
            SetPendingDeletion={SetPendingDeletion}
            updateMutationQ={updateMutationQ}
            deleteMutationQ={deleteMutationQ}
          />
        )}
        {!commentHidden && (
          <button
            className={`text-sm font-medium text-sky-500 ${
              hasInlineVote && 'ml-1'
            }`}
            onClick={() => {
              if (isDetailPage) {
                SetShowComment(!showComment);
              } else {
                router.push(
                  `/n/${datasetID}/#${parentType}-comment/${parentID}`
                );
              }
            }}
          >
            {talkTotal} {commentLabel || 'ความเห็น'}{' '}
            <ChatBubble className="inline text-xl" />
          </button>
        )}
      </div>
      {!commentHidden && (
        <div ref={commentRef}>
          <CommentForm
            parentType={parentType}
            parentID={parentID}
            hidden={!showComment}
            {...getCommentFormText(parentType)}
            title={commentLabel}
          />
          <CommentList
            parentType={parentType}
            parentID={parentID}
            hidden={!showComment}
            toggleVisibility={SetShowComment}
          />
        </div>
      )}
    </>
  );
}

function getCommentFormText(parentType) {
  if (parentType === 'related') {
    return {
      title: 'ความคิดเห็นของคุณต่อข้อมูลนี้',
      placeHolder: 'ข้อคิดเห็น/เสนอแนะสำหรับข้อมูลนี้',
    };
  }
  if (parentType === 'provider') {
    return {
      title: 'ความคิดเห็นของคุณต่อหน่วยงานนี้',
      placeHolder:
        'ข้อคิดเห็น/เสนอแนะสำหรับหน่วยงานนี้ต่อการเปิดเผยข้อมูลชุดนี้',
    };
  }
  return {};
}

function shouldShowCommment(
  parentType: string,
  parentID: string,
  router: NextRouter
) {
  const { route, asPath } = router;
  if (route !== '/n/[ID]') return false;
  const hashOpt = extractHashRoute(asPath);
  if (hashOpt.length !== 2) return false;
  if (
    parentType === 'related' &&
    hashOpt[0] === 'related-comment' &&
    parentID === hashOpt[1]
  )
    return true;
  if (
    parentType === 'provider' &&
    hashOpt[0] === 'provider-comment' &&
    parentID === hashOpt[1]
  )
    return true;
  return false;
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
