type StatusDotProps = {
  state: string;
};

export default function StatusDot({ state }: StatusDotProps) {
  const STATUS_COLOR = {
    inactive: 'bg-red-400',
    negotiate: 'bg-amber-400',
    done: 'bg-green-400',
  };
  const STATUS_TEXT = {
    inactive: 'ไม่มีความเคลื่อนไหว',
    negotiate: 'กำลังประสานงานเปิดเผยข้อมูล',
    done: 'เปิดเผยข้อมูลเรียบร้อยแล้ว',
  };
  const color = STATUS_COLOR[state] || STATUS_COLOR.inactive;
  const txt = STATUS_TEXT[state] || STATUS_TEXT.inactive;
  return (
    <>
      <div className="flex relative h-3 w-3" title={txt}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-20 ${color}`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${color}`}
        ></span>
      </div>
      {state === 'done' && (
        <div className="absolute rounded transition delay-150 origin-bottom rotate-12 text-xl opacity-90 border-4 py-1 px-4 w-fit translate-x-36 -translate-y-6 float-right cursor-pointer bg-green-100 text-green-700 border-green-700 hover:bg-teal-100 hover:text-teal-800 hover:border-teal-800">
          เรียบร้อย ⬇️
        </div>
      )}
    </>
  );
}
