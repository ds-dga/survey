import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const CATEGORY_QUERY = gql`
  query CATEGORY_QUERY {
    items: dataset_category {
      id
      name
      total: datasets_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export default function CategoryOne() {
  const router = useRouter();
  const { data, loading, error } = useQuery(CATEGORY_QUERY);

  // const router = useRouter();
  console.log(loading, error, data, router.query.id);
  return (
    <Main
      meta={<Meta title="Dataset: Category" description="Open data category" />}
    >
      {loading && <p>Loading ... </p>}
      {error && <p>{error.message} ... </p>}
      <p>Category </p>
      {/* <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {data &&
          data.items.map((item) => (
            <CategoryItem key={`ct-${item.id}`} item={item} />
          ))}
      </div> */}
    </Main>
  );
}
