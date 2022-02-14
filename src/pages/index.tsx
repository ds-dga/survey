import { useState } from 'react';

import ArrowDown from '@/icons/ArrowDown';
import ArrowUp from '@/icons/ArrowUp';
import Check from '@/icons/Check';
import Stop from '@/icons/Stop';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

function Vote() {
  const Action = 'up';
  const Point = 3219;
  return (
    <div className="text-2xl flex flex-col items-center">
      <div
        className={`${Action === 'up' ? 'up' : ''}`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "up" ? "-" : "up")
        }}
      >
        <ArrowUp fill={''} />
      </div>
      <div className={`text-center ${Action}`}>{Point}</div>
      <div
        className={`arrow down`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "down" ? "-" : "down")
        }}
      >
        <ArrowDown fill={''} />
      </div>
    </div>
  );
}

function CommentForm({ hidden }: any) {
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
          ความคิดเห็นของคุณ
        </label>
        <div className="mt-1">
          <textarea
            id="about"
            name="about"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="ข้อคิดเห็น/เสนอแนะ"
            defaultValue={''}
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
  );
}

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

function CommentList() {
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
        <CommentItem key={`cm-${ind}`} item={cm} />
      ))}
    </>
  );
}

function Item({ item }: any) {
  const [showComment, SetShowComment] = useState(false);
  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5">
      <div className="pt-3 flex gap-3">
        <Vote />
        <div>
          <p className="mt-1 zmax-w-2xl text-sm text-gray-500">
            {item.category}
          </p>
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {item.title}
          </h3>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          {/* <h3 className="text-sm text-gray-700">
          {item.vote.up} โหวต
          </h3> */}
          <div className="text-sm text-gray-500">
            {item.latestVoted} | {item.vote.up} โหวต{' '}
            <ArrowUp className="inline" fill={'#10b981'} /> {item.vote.down}{' '}
            โหวต <ArrowDown className="inline" fill={'#fb7185'} />
          </div>
        </div>
        <button
          className="text-sm font-medium text-gray-900"
          onClick={() => {
            SetShowComment(!showComment);
          }}
        >
          {item.comments.length} ความคิดเห็น
        </button>
      </div>

      <CommentForm hidden={!showComment} />
      {showComment && <CommentList />}

      <div className="mt-5 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
        <div className="relative border-l-4 border-green-400 pl-2">
          <div className="text-gray-600 italic">ข้อมูลที่ใกล้เคียง</div>
          {item.related.map((related: any, ind: number) => (
            <div className="flex gap-3" key={`${item.id}-related-${ind}`}>
              <div className="text-2xl min-w-fit">
                <Check className="inline" fill={'#10b981'} />{' '}
                <Stop className="inline" fill={'#fb7185'} />
              </div>
              <div>
                <div>{related.title}</div>
                <div className="text-md text-gray-600">by {related.source}</div>
                <div className="text-sm text-gray-500">
                  {related.vote.up - related.vote.down} โหวต{' '}
                  <Check className="inline" /> {related.comments.length}{' '}
                  ความคิดเห็น
                </div>

                <CommentForm hidden={!showComment} />
              </div>
            </div>
          ))}
        </div>

        <div className="relative border-l-4 border-pink-400 pl-2">
          <div className="text-gray-600 italic">หน่วยงานที่เปิดเผยข้อมูล</div>
          {item.organizations.map((org: any, ind: number) => (
            <div className="flex gap-3" key={`${item.id}-org-${ind}`}>
              <div className="text-2xl min-w-fit">
                <Check className="inline" fill={'#10b981'} />{' '}
                <Stop className="inline" fill={'#fb7185'} />
              </div>
              <div className="pt-2">{org.title}</div>
            </div>
          ))}
          <button
            type="button"
            className="mt-5 px-4 py-1 text-md rounded-full text-white hover:text-white hover:border-transparent focus:outline-none focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-400 hover:scale-105 ease-in-out duration-300"
          >
            เพิ่มหน่วยงานที่อยากให้เปิดข้อมูล
          </button>

          <CommentForm hidden={!showComment} />
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const item = {
    category: 'เศรษฐกิจ การเงินและอุตสาหกรรม',
    title: 'ข้อมูลค่าจ้างตามมาตรการการใช้แรงงาน',
    latestVoted: 'โหวตล่าสุด 4 วันก่อน',
    vote: {
      up: 104,
      down: 6,
    },
    comments: [],
    related: [
      {
        title: 'ค่าจ้างแรงงานภาคธุรกิจบริการ/ท่องเที่ยว',
        source: 'กลุ่มสถิติ แรงงาน กองสถิติสังคม',
        vote: {
          up: 3,
          down: 1,
        },
        comments: [],
      },
    ],
    organizations: [
      {
        title: 'กลุ่มสถิติ แรงงาน กองสถิติสังคม/ท่องเที่ยว',
        vote: {
          up: 3,
          down: 1,
        },
        comments: [],
      },
    ],
  };

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {/* <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"> */}
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 mb-20">
        <Item item={item} />
      </div>
    </Main>
  );
};

export default Index;
