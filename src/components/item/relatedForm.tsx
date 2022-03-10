import React, { useRef } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

export default function RelatedForm({
  datasetID,
  hidden,
  handleFormVisible,
}: any) {
  const [addRelated, { loading }] = useMutation(RELATED_ADD_MUTATAION);
  const {
    register,
    formState: { errors: formErrors },
    handleSubmit,
  } = useForm();
  const inputRef = useRef() as React.RefObject<HTMLTextAreaElement>;

  return (
    <form
      action="#"
      method="POST"
      className={`${
        hidden ? 'hidden' : ''
      } mt-5 ease-in-out transition duration-150`}
      onSubmit={handleSubmit(async (data) => {
        const result = await addRelated({
          variables: {
            datasetID,
            title: data.title,
            url: data.url,
            maintainer: data.maintainer,
          },
        });
        if (result && result.data) {
          if (inputRef.current) inputRef.current.value = '';
          handleFormVisible(false);
        }
      })}
    >
      <div>
        <label
          htmlFor="Add new provider"
          className="block text-sm font-medium text-gray-600"
        >
          <i>เพิ่มข้อมูลเปิดที่ใกล้เคียง</i>
        </label>
        <div className="mt-1">
          <div className="grid grid-cols-1 gap-3">
            <label className="block">
              <span className="text-gray-700">
                ชื่อชุดข้อมูล <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                className={`mt-1 block w-full rounded-md bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:ring-0 `}
                placeholder="ชื่อชุดข้อมูล"
                {...register('title', { required: true })}
              />
              {formErrors.title && (
                <div className={`text-sm text-red-500 italic`}>
                  {formErrors.title.type}
                  {formErrors.title.message}
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">
                URL ข้อมูล <span className="text-red-500">*</span>
              </span>
              <input
                type="url"
                className={`mt-1 block w-full rounded-md bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:ring-0 `}
                placeholder="URL"
                {...register('url', { required: true })}
              />
              {formErrors.url && (
                <div className={`text-sm text-red-500 italic`}>
                  {formErrors.url.type}
                  {formErrors.url.message}
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">
                หน่วยงานเจ้าของข้อมูล{' '}
                <span className="text-sm italic text-gray-500">
                  (ไม่บังคับ)
                </span>
              </span>
              <input
                type="text"
                className={`mt-1 block w-full rounded-md bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:ring-0 `}
                placeholder="ชื่อหน่วยงานเจ้าของข้อมูล"
                {...register('maintainer')}
              />
              {formErrors.maintainer && (
                <div className={`text-sm text-red-500 italic`}>
                  {formErrors.maintainer.type}
                  {formErrors.maintainer.message}
                </div>
              )}
            </label>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          ใส่ชื่อให้ครบถ้วนเพื่อความสะดวกในการติดตาม แก้ไข และพัฒนาต่อ
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          className="inline-flex justify-center py-2 px-4 mx-2 border border-b-4 text-sm font-medium shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 ease-in-out transition text-gray-500 border-gray-500 hover:border-emerald-300 hover:text-emerald-400"
          onClick={(evt) => {
            evt.preventDefault();
            handleFormVisible(false);
          }}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border  border-b-4 text-sm font-medium shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2  ease-in-out transition border-blue-500 text-blue-500 hover:bg-blue-500 focus:ring-blue-500 hover:text-white`}
        >
          {loading ? 'Saving...' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
}

const RELATED_ADD_MUTATAION = gql`
  mutation RELATED_ADD_MUTATAION(
    $datasetID: uuid!
    $title: String!
    $url: String!
    $maintainer: String!
  ) {
    insert_dateset_related_one(
      object: {
        dataset_id: $datasetID
        title: $title
        url: $url
        maintainer: $maintainer
      }
    ) {
      id
      title
      url
      created_at
    }
  }
`;
