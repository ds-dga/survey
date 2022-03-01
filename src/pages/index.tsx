import PopularGroup from '@/components/item/popularGroup';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

import { CategoryGroup } from './category';

const Index = () => {
  /* const item = {
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
  }; */

  // console.log('Indexpage: session =', loading, session);

  return (
    <Main
      meta={
        <Meta
          title="Open Data Survey - DGA"
          description="Open data survey aims to find the most wanted dataset from crowdsourcing, so DGA could laser focus on collaborating with the organization with the particular set of data to open to public."
        />
      }
    >
      {/* <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"> */}
      {/* {session && (
        <>
          <h1>
            {session.user.name} {session.user.email} {session.user.image}
          </h1>
        </>
      )} */}

      <h1 className="font-semibold text-2xl text-gray-700 text-center">
        ชุดข้อมูลที่ได้รับความสนใจมากที่สุด
      </h1>
      <PopularGroup limit={4} />

      <h1 className="font-semibold text-2xl text-gray-700 text-center">
        กลุ่มชุดข้อมูล
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 mb-20">
        {/* <Item item={item} />
        <Item item={item} />
        <Item item={item} /> */}
        <CategoryGroup />
      </div>
    </Main>
  );
};

export default Index;
