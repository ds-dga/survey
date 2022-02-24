import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router"

import { Meta } from "@/layout/Meta"
import { Main } from "@/templates/Main"
// import Item from "@/components/item"

const CATEGORY_ITEMS_QUERY = gql`
  query CATEGORY_ITEMS_QUERY($categoryID: Int!, $where: dataset_bool_exp!) {
    items: dataset(
      where: $where
      order_by: [
        { points_aggregate: { sum: { point: desc_nulls_last } } }
        { id: asc }
      ]
    ) {
      name
      category {
        name
      }
      points(order_by: [{ created_at: desc }], limit: 1) {
        created_at
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
    category: dataset_category(where: { id: { _eq: $categoryID } }) {
      name
    }
  }
`

export default function CategoryOne() {
  const router = useRouter()
  const { data, loading, error } = useQuery(CATEGORY_ITEMS_QUERY, {
    variables: {
      categoryID: router.query.id,
      where: {
        category: {
          id: { _eq: router.query.id },
        },
      },
    },
    pollInterval: 6000,
  })

  // const router = useRouter();
  console.log(loading, error, data, router.query.id)
  return (
    <Main
      meta={<Meta title="Dataset: Category" description="Open data category" />}
    >
      {loading && <p>Loading ... </p>}
      {error && <p>{error.message} ... </p>}
      <div>{data ? data.category[0].name : "Category"}</div>
      <div className="">
        {/* {data &&
          data.items.map((item) => <Item key={`ct-${item.id}`} item={item} />)} */}
      </div>
    </Main>
  )
}
