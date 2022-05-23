import { useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { DATASET_ONE_QUERY } from '@/components/item/q';

import Loading from '../loading';
import { UserProviderType } from '../UserProvider';

type ModControlProps = {
  datasetID: string;
  state: string;
  user: UserProviderType;
};

export default function ModControlInline({
  datasetID,
  state,
  user,
}: ModControlProps) {
  const { register } = useForm({
    defaultValues: {
      state: state || 'inactive',
    },
  });
  const [Busy, SetBusy] = useState(false);
  const [mutateStatus] = useMutation(STATUS_MUTATION);
  return (
    <div className="text-xs text-gray-500 flex">
      <Loading hidden={!Busy} />
      <form action="#">
        <select
          {...register('state', { required: true })}
          className="block text-xs w-fit mt-0 px-3 pr-10 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
          onChange={async (evt) => {
            SetBusy(true);
            const v = evt.currentTarget.value;
            if (state !== v) {
              const uw = {
                voted_by: {
                  _eq: user.id,
                },
              };
              await mutateStatus({
                variables: {
                  datasetID,
                  status: v,
                },
                refetchQueries: [
                  {
                    query: DATASET_ONE_QUERY,
                    variables: {
                      ID: datasetID,
                      votedByWhere: uw,
                      relatedVotedWhere: uw,
                      providerVotedWhere: uw,
                    },
                  },
                ],
              });
            }
            SetBusy(false);
            return true;
          }}
        >
          <option value="inactive">ยังไม่มีความคืบหน้า</option>
          <option value="negotiate">อยู่ในขั้นตอนการเจรจา</option>
          <option value="done">เปิดชุดข้อมูลแล้ว</option>
        </select>
      </form>
    </div>
  );
}

const STATUS_MUTATION = gql`
  mutation STATUS_MUTATION($datasetID: uuid!, $status: String!) {
    update_dataset_by_pk(
      pk_columns: { id: $datasetID }
      _set: { status: $status }
    ) {
      updated_at
      status
    }
  }
`;
