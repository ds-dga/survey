function CommentItem({ item }: any) {
  return (
    <div className="my-2 px-2 py-3 border-l-4 border-slate-400 hover:bg-slate-200">
      <div className="text-sm text-gray-500">
        👤 {item.author} ... ⏰ <span className="italic">{item.timestamp}</span>
      </div>
      <div className="text-md text-gray-800">{item.comment}</div>
    </div>
  );
}

export default function CommentList({ toggleVisibility }: any) {
  const cms = [
    {
      author: 'AB CD',
      timestamp: '3 วันก่อน',
      comment: 'ข้อมูลดี แต่อยากให้เพิ่ม location',
    },
    {
      author: 'AB FFE',
      timestamp: '2 วันก่อน',
      comment: 'ข้อมูลแย่ ไม่ละเอียดเลย location ก็ไม่มี',
    },
    { author: 'ZX ZY', timestamp: '1 วันก่อน', comment: 'ขอบคุณครับ' },
  ];
  return (
    <>
      {cms.map((cm: any, ind: number) => (
        <CommentItem
          key={`cm-${ind}`}
          item={cm}
          toggleVisibility={toggleVisibility}
        />
      ))}
    </>
  );
}
