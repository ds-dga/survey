import { useState } from 'react';

import Check from '@/icons/Check';
import Stop from '@/icons/Stop';

import ProviderForm from './providerForm';

type OrgProps = {
  id: Number;
  name: String;
  points: String[];
  vote_up: any;
  vote_down: any;
  created_by: String;
};
type ItemProps = {
  organization: OrgProps;
};

type ProviderProps = {
  orgs: OrgProps[];
  datasetID: string;
};

function ProviderItem({ organization }: ItemProps) {
  /*
    Check - is like upvote
    Stop - is like downvote, but if it's creator, then it's deletion
  */
  return (
    <div className="flex gap-3">
      <div className="text-2xl min-w-fit">
        <Check className="inline" fill={'#10b981'} />{' '}
        <Stop className="inline" fill={'#fb7185'} />
      </div>
      <div className="pt-2">{organization.name}</div>
    </div>
  );
}

export default function Provider({ orgs, datasetID }: ProviderProps) {
  const [formVisible, SetFormVisible] = useState(false);
  return (
    <>
      <div className="text-gray-600 italic">
        {orgs.length
          ? 'หน่วยงานที่เปิดเผยข้อมูล'
          : 'ยังไม่มีข้อมูลหน่วยงานที่เปิดเผยข้อมูล'}
      </div>
      {orgs.map((org: any, ind: number) => (
        <ProviderItem key={`${datasetID}-org-${ind}`} organization={org} />
      ))}
      <button
        type="button"
        className="mt-5 px-4 py-1 text-sm rounded-full text-white hover:text-white hover:border-transparent focus:outline-none focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-400 hover:scale-105 ease-in-out duration-300"
        onClick={() => {
          SetFormVisible(!formVisible);
        }}
      >
        {formVisible
          ? 'ยกเลิกการเพิ่มหน่วยงาน'
          : 'เพิ่มหน่วยงานที่อยากให้เปิดข้อมูล'}
      </button>

      <ProviderForm
        datasetID={datasetID}
        hidden={!formVisible}
        handleFormVisible={SetFormVisible}
      />
    </>
  );
}
