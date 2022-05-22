import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

import Loading from '@/components/loading';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

function CategoryItem({ item }: any) {
  return (
    <Link href={`/category/${item.id}`} passHref>
      <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 p-2 flex flex-col justify-center items-center hover:bg-emerald-100 hover:border-emerald-100 hover:font-medium transition cursor-pointer overflow-hidden">
        <span className="absolute top-0 right-0 pr-1 text-stone-300 font-semibold text-lg z-0">
          {item.total.aggregate.count}
        </span>
        <img className="w-14 h-14" src={item.image} alt={item.name} />
        <div className="text-center overflow-clip">{item.name}</div>
      </div>
    </Link>
  );
}

export function CategoryGroup() {
  const { data, loading, error } = useQuery(CATEGORY_QUERY);
  const items = data ? data.items : [];
  return (
    <>
      <Loading hidden={!loading} />
      {error && <p>{error.message} ... </p>}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {items.map((item) => (
          <CategoryItem key={`ct-${item.id}`} item={item} />
        ))}
      </div>
    </>
  );
}

export default function Category() {
  return (
    <Main
      meta={<Meta title="Dataset: Category" description="Open data category" />}
    >
      <div className="m-3 h-5/6">
        <div className="flex flex-row items-center">
          <img className={`h-10`} src={`/assets/logo/digi.png`} alt="DIGI" />
          <h1 className="font-semibold text-2xl text-gray-700 text-center mb-5 flex-1">
            กลุ่มชุดข้อมูล
          </h1>
        </div>
        <CategoryGroup />
        <div className="my-6"></div>
      </div>
    </Main>
  );
}

const CATEGORY_QUERY = gql`
  query CATEGORY_QUERY {
    items: dataset_category {
      id
      name
      image
      total: datasets_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
