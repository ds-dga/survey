import { gql, useQuery } from "@apollo/client"
import { Meta } from "@/layout/Meta"
import { Main } from "@/templates/Main"
import Link from "next/link"

function CategoryItem({ item }: any) {
  return (
    <Link href={`/category/${item.id}`}>
      <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5 h-25 flex justify-center items-center hover:bg-slate-200 hover:border-slate-200 hover:font-medium transition">
        <span className="absolute top-0 right-0 pr-1 text-stone-300 font-semibold text-lg z-0">
          {item.total.aggregate.count}
        </span>
        <span className="text-center z-10">{item.name}</span>
      </div>
    </Link>
  )
}

export default function Category() {
  const { data, loading, error } = useQuery(CATEGORY_QUERY)
  return (
    <Main
      meta={<Meta title="Dataset: Category" description="Open data category" />}
    >
      {loading && <p>Loading ... </p>}
      {error && <p>{error.message} ... </p>}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {data &&
          data.items.map((item) => (
            <CategoryItem key={`ct-${item.id}`} item={item} />
          ))}
      </div>
    </Main>
  )
}

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
`
