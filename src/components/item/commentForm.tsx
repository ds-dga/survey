import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { COMMENT_QUERY } from './comment';

type CommentFormProps = {
  parentType: string;
  parentID: string;
  hidden: boolean;
};

export default function CommentForm({
  parentType,
  parentID,
  hidden,
}: CommentFormProps) {
  const [createComment] = useMutation(CREATE_COMMENT_FORM);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { note: '' } });

  const onSubmit = handleSubmit(async (data) => {
    console.log('[commentForm] submit', data);
    const result = await createComment({
      variables: {
        note: data.note.trim(),
        parentID,
        parentType,
      },
      refetchQueries: [
        {
          query: COMMENT_QUERY,
          variables: {
            parentID,
            parentType,
          },
        },
      ],
    });
    if (result.data) {
      reset();
    }
    console.log('mutate createComment: ', result);
  });

  console.log('[commentForm] err:', errors);

  return (
    <form
      onSubmit={onSubmit}
      className={`${
        hidden ? 'hidden' : ''
      } mt-5 ease-in-out transition duration-150`}
    >
      <div>
        <label
          htmlFor="commentForm"
          className="block text-sm font-medium text-gray-700"
        >
          ความคิดเห็นของคุณต่อชุดข้อมูลนี้
          {errors && errors.note && (
            <span className="px-3 italic text-rose-500">จำเป็น</span>
          )}
        </label>
        <div className="mt-1">
          <textarea
            {...register('note', { required: true })}
            id="commentForm"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="ข้อคิดเห็น/เสนอแนะสำหรับชุดข้อมูลนี้"
            defaultValue={''}
          />
        </div>
        <div className="flex content-between">
          <p className="mt-2 text-sm text-gray-500">
            อธิบายความเห็นให้ชัดเจน พร้อมทั้งใส่หลักฐานอ้างอิงถ้ามี
            เพื่อความสะดวกในการติดตาม แก้ไข และพัฒนาต่อ
          </p>
          <div className="text-right flex-grow my-2">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-blue-500 border-b-4 text-sm font-medium text-blue-500 shadow-md hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transition"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

const CREATE_COMMENT_FORM = gql`
  mutation CREATE_COMMENT_FORM(
    $note: String!
    $parentType: comment_parent_type_enum!
    $parentID: uuid!
  ) {
    insert_comments(
      objects: { parent_type: $parentType, parent_id: $parentID, note: $note }
    ) {
      returning {
        id
        created_at
      }
    }
  }
`;
