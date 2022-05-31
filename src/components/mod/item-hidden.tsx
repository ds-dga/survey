/* eslint-disable @typescript-eslint/no-use-before-define */
import { gql, useMutation } from '@apollo/client';

import Eye from '@/icons/Eye';
import EyeSlash from '@/icons/EyeSlash';

type Props = {
  item: any;
};

export default function CommentHiddenToggle({ item }: Props) {
  const [updateQ, { loading }] = useMutation(MUTATE_COMMENT_HIDDEN);
  return (
    <button
      type="button"
      className=" cursor-pointer my-1 p-2 text-2xl text-slate-800 hover:text-pink-500"
      disabled={loading}
      onClick={async (evt) => {
        evt.preventDefault();
        console.log('check here', item, '--> ', !item.hidden);
        const res = await updateQ({
          variables: {
            itemID: item.id,
            hidden: !item.hidden,
          },
        });
        console.log('[ItemCostMutate] result: ', res);
      }}
    >
      {item.hidden && <EyeSlash />}
      {!item.hidden && <Eye />}
    </button>
  );
}

const MUTATE_COMMENT_HIDDEN = gql`
  mutation MUTATE_COMMENT_HIDDEN($itemID: bigint!, $hidden: Boolean!) {
    update_comments_by_pk(
      _set: { hidden: $hidden }
      pk_columns: { id: $itemID }
    ) {
      updated_at
      hidden
      hidden_by
      id
    }
  }
`;
