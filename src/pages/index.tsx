import PopularGroup from '@/components/item/popularGroup';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

import { CategoryGroup } from './category';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Open Data Survey - DGA"
          description="Open data survey aims to find the most wanted dataset from crowdsourcing, so DGA could laser focus on collaborating with the organization with the particular set of data to open to public."
        />
      }
    >
      <div className="m-3">
        <div className="flex flex-row items-center">
          <img className={`h-10`} src={`/assets/logo/digi.png`} alt="DIGI" />
          <h1 className="flex-1 font-semibold text-2xl text-gray-700 text-center">
            ชุดข้อมูลที่ได้รับความสนใจมากที่สุด
          </h1>
        </div>
        <PopularGroup limit={4} />

        <h1 className="font-semibold text-2xl text-gray-700 text-center">
          กลุ่มชุดข้อมูล
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 mb-20">
          <CategoryGroup />
        </div>
      </div>
    </Main>
  );
};

export default Index;
