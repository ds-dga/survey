/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import { PaginatorVarsType } from '../Paginator';

type ModRecentLikesProps = {
  handleItemTotalChanged: Function;
  paginatorVars: PaginatorVarsType;
};
type ModRecentCommentsProps = {
  handleItemTotalChanged: Function;
  paginatorVars: PaginatorVarsType;
  parentType?: string;
};

export type { ModRecentLikesProps, ModRecentCommentsProps };
