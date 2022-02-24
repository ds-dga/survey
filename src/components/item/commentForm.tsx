

export default function CommentForm({ hidden }: any) {
  return (
    <form
      action="#"
      method="POST"
      className={`${
        hidden ? "hidden" : ""
      } mt-5 ease-in-out transition duration-150`}
    >
      <div>
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700"
        >
          ความคิดเห็นของคุณ
        </label>
        <div className="mt-1">
          <textarea
            id="about"
            name="about"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="ข้อคิดเห็น/เสนอแนะ"
            defaultValue={""}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          อธิบายความเห็นให้ชัดเจน พร้อมทั้งใส่หลักฐานอ้างอิงถ้ามี
          เพื่อความสะดวกในการติดตาม แก้ไข และพัฒนาต่อ
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-blue-500 border-b-4 shadow-sm text-sm font-medium text-blue-500 shadow-md hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ease-in-out transition"
        >
          บันทึก
        </button>
      </div>
    </form>
  )
}
