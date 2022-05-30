import { useEffect } from 'react';

import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function RelatedRedirect() {
  const router = useRouter();
  const { data } = useQuery(RELATED_REDIRECT_QUERY, {
    variables: {
      ID: router.query.ID,
    },
  });

  useEffect(() => {
    if (data && data.item) {
      router.push(
        `/n/${data.item.dataset.id}#related-comment/${router.query.ID}`
      );
    }
  }, [data, router]);

  return (
    <Main
      meta={
        <Meta title={`Dataset: redirecting`} description="Open data category" />
      }
    >
      <div className="w-full flex justify-center items-center">
        <div>Loading...</div>
      </div>
    </Main>
  );
}

const RELATED_REDIRECT_QUERY = gql`
  query RELATED_REDIRECT_QUERY($ID: uuid!) {
    item: dataset_related_by_pk(id: $ID) {
      dataset {
        id
      }
    }
  }
`;
