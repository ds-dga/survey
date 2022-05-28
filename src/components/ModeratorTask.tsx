import { useState } from 'react';

import ModRecentComments from './mod/ModRecentComments';
import ModRecentDatasetLikes from './mod/ModRecentDatasetLikes';
import ModRecentProviderLikes from './mod/ModRecentProviderLikes';
import ModRecentRelatedLikes from './mod/ModRecentRelatedLikes';
import Tab from './Tab';

const LikeTabs = ['ชุดข้อมูล', 'ชุดข้อมูลใกล้เคียง', 'หน่วยงาน'];
const CommentTabs = ['ชุดข้อมูล', 'ชุดข้อมูลใกล้เคียง'];

export default function ModeratorTask() {
  const [TabLike, SetTabLike] = useState(LikeTabs[0]);
  const [TabComment, SetTabComment] = useState(CommentTabs[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h1 className="text-xl bold text-slate-400">Recent likes</h1>
        <Tab items={LikeTabs} active={TabLike} handleTabChanged={SetTabLike} />
        {TabLike === 'ชุดข้อมูล' && <ModRecentDatasetLikes />}
        {TabLike === 'ชุดข้อมูลใกล้เคียง' && <ModRecentRelatedLikes />}
        {TabLike === 'หน่วยงาน' && <ModRecentProviderLikes />}
      </div>
      <div>
        <h1 className="text-xl bold text-slate-400">Recent comments</h1>
        <Tab
          items={CommentTabs}
          active={TabComment}
          handleTabChanged={SetTabComment}
        />
        <ModRecentComments />
      </div>
    </div>
  );
}
