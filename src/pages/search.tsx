import { useEffect, useRef, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { throttle } from 'lodash';
import { useSession } from 'next-auth/react';

import MinimalItem from '@/components/item/minimal';
import Loading from '@/components/loading';
import Paginator, { PaginatorOffset } from '@/components/Paginator';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Search() {
  const [PaginatorVars, SetPaginatorVars] = useState({
    currPageIndex: 1,
    itemPerPage: 10,
    itemTotal: 0,
  });
  const { data: session } = useSession();
  const [Q, SetQ] = useState('');
  const [GQLVars, SetGQLVars] = useState({
    votedByWhere: {},
    relatedVotedWhere: {},
    providerVotedWhere: {},
    where: {},
    limit: PaginatorVars.itemPerPage,
    offset: PaginatorOffset(PaginatorVars),
  });

  const throttled = useRef(
    throttle(
      (newValue) => {
        let where = {};
        if (newValue.length > 0)
          where = {
            name: { _ilike: `%${newValue}%` },
          };
        SetGQLVars((prev) => ({
          ...prev,
          where,
        }));
      },
      1000,
      { trailing: true }
    )
  );
  useEffect(() => throttled.current(Q), [Q]);
  useEffect(() => {
    if (session) {
      const uw = {
        voted_by: {
          _eq: session.user.uid,
        },
      };
      SetGQLVars((prev) => ({
        ...prev,
        votedByWhere: uw,
      }));
    }
  }, [session]);

  const { data, loading } = useQuery(DATASET_SEARCH_QUERY, {
    variables: GQLVars,
    pollInterval: 1000 * 10, // 7s
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    SetPaginatorVars((prev) => {
      return {
        ...prev,
        itemTotal: (data && data.total.aggregate.count) || 0,
      };
    });
  }, [data]);

  useEffect(() => {
    if (loading) return;
    SetGQLVars((prevState) => {
      // Object.assign would also work
      const offset = PaginatorOffset(PaginatorVars);
      return { ...prevState, offset, limit: PaginatorVars.itemPerPage };
    });
  }, [PaginatorVars, loading]);

  return (
    <Main
      meta={
        <Meta title="Open data survey" description="Open data survey it is" />
      }
    >
      <div className="container mx-auto">
        <div className="flex flex-row items-center">
          <img className={`h-10`} src={`/assets/logo/digi.png`} alt="DIGI" />
          <h1 className="font-semibold text-lg text-gray-700 text-center flex-1 my-5">
            ค้นหารายการข้อมูลเปิดที่ประชาชนต้องการจากภาครัฐ
          </h1>
        </div>
        <Loading hidden={!loading} />
        {/* {session && <LoggedProfile user={session.user} />}
        {!session && (
          <div>
            <Link href={`/api/auth/signin`}>Login</Link>
          </div> */}
        {/* )} */}
        <div className="px-1">
          <input
            className="form-input text-xl px-4 py-3 rounded-md w-full border-0 border-1 border-slate-300 hover:shadow-md active:border-1"
            type="text"
            defaultValue={Q}
            placeholder="ค้นหา..."
            onChange={(e) => {
              const v = e.target.value.trim();
              SetQ(v);
            }}
            autoComplete="off"
          />
        </div>

        <Paginator vars={PaginatorVars} handleVarsChanged={SetPaginatorVars} />

        <div className="mt-6 grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.items.map((item) => (
              <MinimalItem key={`s-${item.id}`} item={item} />
            ))}
        </div>

        {data?.items && data.items.length === 0 && (
          <div className="text-center text-slate-500">
            ไม่พบข้อมูลตามคำค้นหา{' '}
            <span className="italic">&quot;{Q}&quot;</span>
          </div>
        )}

        <Paginator vars={PaginatorVars} handleVarsChanged={SetPaginatorVars} />

        <div className="mb-20"></div>
      </div>
    </Main>
  );
}

const DATASET_SEARCH_QUERY = gql`
  query DATASET_SEARCH_QUERY(
    $where: dataset_bool_exp!
    $votedByWhere: dataset_points_bool_exp!
    $limit: Int!
    $offset: Int!
  ) {
    total: dataset_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    items: dataset(
      where: $where
      order_by: [
        { points_aggregate: { sum: { point: desc_nulls_last } } }
        { id: asc }
      ]
      offset: $offset
      limit: $limit
    ) {
      id
      name
      status
      category {
        id
        name
      }
      my_vote: points(where: $votedByWhere) {
        point
      }
      related_aggregate {
        aggregate {
          count
        }
      }
      providers_aggregate {
        aggregate {
          count
        }
      }
      points(order_by: [{ updated_at: desc }], limit: 1) {
        updated_at
      }
      vote_up: points_aggregate(where: { point: { _gte: 0 } }) {
        aggregate {
          sum {
            point
          }
        }
      }
      vote_down: points_aggregate(where: { point: { _lt: 0 } }) {
        aggregate {
          sum {
            point
          }
        }
      }
    }
  }
`;
