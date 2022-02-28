import React, { useRef, useState } from 'react';

import { gql, useMutation } from '@apollo/client';

export default function ProviderForm({
  datasetID,
  hidden,
  handleFormVisible,
}: any) {
  const [addProvider, { loading, error }] = useMutation(PROVIDER_ADD_MUTATAION);
  const inputRef = useRef() as React.RefObject<HTMLTextAreaElement>;
  const [Text, SetText] = useState('');

  const disabled = loading || error !== undefined || Text.length === 0;
  return (
    <form
      action="#"
      method="POST"
      className={`${
        hidden ? 'hidden' : ''
      } mt-5 ease-in-out transition duration-150`}
    >
      <div>
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700"
        >
          เพิ่มหน่วยงานที่อยากให้เปิดข้อมูลนี้
        </label>
        <div className="mt-1">
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id="about"
            name="about"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="ชื่อหน่วยงานที่อยากให้เปิดข้อมูล"
            defaultValue={Text}
            onChange={(e) => {
              SetText(e.currentTarget.value.trim());
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          ใส่ชื่อให้ครบถ้วนเพื่อความสะดวกในการติดตาม แก้ไข และพัฒนาต่อ
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="submit"
          disabled={disabled}
          className={`inline-flex justify-center py-2 px-4 border  border-b-4 text-sm font-medium shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2  ease-in-out transition ${
            disabled
              ? 'cursor-not-allowed border-gray-500 text-gray-500  focus:ring-gray-500 hover:white hover:text-gray'
              : 'border-blue-500 text-blue-500 hover:bg-blue-500 focus:ring-blue-500 hover:text-white '
          }`}
          onClick={async (evt) => {
            evt.preventDefault();
            const result = await addProvider({
              variables: {
                datasetID,
                name: Text,
              },
            });
            if (result && result.data) {
              if (inputRef.current) inputRef.current.value = '';
              handleFormVisible(false);
            }
          }}
        >
          {loading ? 'Saving...' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
}

const PROVIDER_ADD_MUTATAION = gql`
  mutation PROVIDER_ADD_MUTATAION($datasetID: uuid!, $name: String!) {
    insert_dataset_provider_one(
      object: { dataset_id: $datasetID, name: $name }
      on_conflict: {
        constraint: dataset_provider_dataset_id_name_key
        update_columns: [name]
      }
    ) {
      id
      name
      created_at
    }
  }
`;
