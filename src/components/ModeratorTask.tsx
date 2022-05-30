import { useEffect, useState } from 'react';

import ModRecentComments from './mod/ModRecentComments';
import ModRecentDatasetLikes from './mod/ModRecentDatasetLikes';
import ModRecentProviderLikes from './mod/ModRecentProviderLikes';
import ModRecentRelatedLikes from './mod/ModRecentRelatedLikes';
import Paginator from './Paginator';
import Tab from './Tab';

const LikeTabs = ['ชุดข้อมูล', 'ชุดข้อมูลใกล้เคียง', 'หน่วยงาน'];
const CommentTabs = [
  // 'ทั้งหมด',
  'ชุดข้อมูล',
  'ชุดข้อมูลใกล้เคียง',
];

export default function ModeratorTask() {
  const [PaginatorVars, SetPaginatorVars] = useState({
    currPageIndex: 1,
    itemPerPage: 10,
    itemTotal: 0,
  });
  const [TabLike, SetTabLike] = useState(LikeTabs[0]);

  useEffect(() => {
    SetPaginatorVars((prev) => ({
      ...prev,
      currPageIndex: 1,
    }));
  }, [TabLike]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h1 className="text-xl bold text-slate-400">Recent likes</h1>
        <Tab items={LikeTabs} active={TabLike} handleTabChanged={SetTabLike} />

        <Paginator
          vars={PaginatorVars}
          handleVarsChanged={SetPaginatorVars}
          direction="col"
        />
        {TabLike === 'ชุดข้อมูล' && (
          <ModRecentDatasetLikes
            paginatorVars={PaginatorVars}
            handleItemTotalChanged={(tot: number) => {
              if (tot === PaginatorVars.itemTotal) return;
              SetPaginatorVars((prev) => ({ ...prev, itemTotal: tot }));
            }}
          />
        )}
        {TabLike === 'ชุดข้อมูลใกล้เคียง' && (
          <ModRecentRelatedLikes
            paginatorVars={PaginatorVars}
            handleItemTotalChanged={(tot: number) => {
              if (tot === PaginatorVars.itemTotal) return;
              SetPaginatorVars((prev) => ({ ...prev, itemTotal: tot }));
            }}
          />
        )}
        {TabLike === 'หน่วยงาน' && (
          <ModRecentProviderLikes
            paginatorVars={PaginatorVars}
            handleItemTotalChanged={(tot: number) => {
              if (tot === PaginatorVars.itemTotal) return;
              SetPaginatorVars((prev) => ({ ...prev, itemTotal: tot }));
            }}
          />
        )}
      </div>
      <ModComments />
    </div>
  );
}

function ModComments() {
  const [PaginatorVars, SetPaginatorVars] = useState({
    currPageIndex: 1,
    itemPerPage: 10,
    itemTotal: 0,
  });
  const [TabComment, SetTabComment] = useState(CommentTabs[0]);
  return (
    <div>
      <h1 className="text-xl bold text-slate-400">Recent comments</h1>
      <Tab
        items={CommentTabs}
        active={TabComment}
        handleTabChanged={SetTabComment}
      />

      <Paginator
        vars={PaginatorVars}
        handleVarsChanged={SetPaginatorVars}
        direction="col"
      />

      <ModRecentComments
        paginatorVars={PaginatorVars}
        handleItemTotalChanged={(tot: number) => {
          if (tot === PaginatorVars.itemTotal) return;
          SetPaginatorVars((prev) => ({ ...prev, itemTotal: tot }));
        }}
        parentType={TabComment === 'ทั้งหมด' ? '' : TabComment}
      />
    </div>
  );
}
