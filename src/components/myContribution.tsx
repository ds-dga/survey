import { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import BuildingIcon from '@/icons/Building';
import Check from '@/icons/Check';
import FileTextIcon from '@/icons/FileText';
import Stop from '@/icons/Stop';
import { displayDatetime } from '@/libs/day';

import Loading from './loading';

interface DS {
  id: String;
  name: String;
}
interface Contribution {
  id: String;
  name: String;
  title: String;
  created_at: String;
  dataset: DS;
  score: any;
}

export default function MyContribution() {
  const [Items, SetItems] = useState<Contribution[]>([]);
  const [Total, SetTotal] = useState(0);
  const { data: session } = useSession();
  const { data, loading } = useQuery(MY_CONTRIBUTION_QUERY, {
    variables: {
      offset: 0,
      limit: 5,
      userID: session?.user.uid,
    },
    skip: !session,
  });

  useEffect(() => {
    if (!data) return;
    const all: Contribution[] = [...data.provider, ...data.related].sort(
      (a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix()
    );
    if (Total > 0) return;
    SetTotal(
      data.provider_total.aggregate.count + data.related_total.aggregate.count
    );
    SetItems(all);
  }, [data, Total]);

  return (
    <ul className="list-inside space-y-2">
      <Loading hidden={!loading} />
      {Items.map((item) => {
        const pnt = item.score.aggregate.sum.point;
        const c = getColor(pnt);
        return (
          <li key={`ic-${item.id}`}>
            <div className="text-teal-600 flex gap-1 items-center self-center content-center">
              <div className={`${c}`}>{pnt}</div>
              <div className={`${c}`}>{getIcon(pnt)}</div>
              {item.name ? (
                <>
                  <BuildingIcon /> {item.name}
                </>
              ) : (
                <>
                  <FileTextIcon />
                  {item.title}
                </>
              )}
            </div>
            <Link href={`/n/${item.dataset.id}`} passHref>
              <div className="text-gray-500 text-sm pl-8 cursor-pointer">
                {item.dataset.name}
              </div>
            </Link>
            <div className="text-gray-500 text-xs pl-8">
              เมื่อวันที่ {displayDatetime(item.created_at)}
            </div>
          </li>
        );
      })}
      {Items.length === 0 && <li>ไม่มีข้อมูล</li>}
    </ul>
  );
}

const MY_CONTRIBUTION_QUERY = gql`
  query MY_CONTRIBUTION_QUERY($userID: uuid!, $offset: Int!, $limit: Int!) {
    provider: dataset_provider(
      where: { created_by: { _eq: $userID } }
      order_by: { created_at: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      created_at
      name
      score: points_aggregate {
        aggregate {
          sum {
            point
          }
        }
      }
      dataset {
        id
        name
      }
    }
    provider_total: dataset_provider_aggregate(
      where: { created_by: { _eq: $userID } }
    ) {
      aggregate {
        count
      }
    }
    related_total: dataset_related_aggregate(
      where: { created_by: { _eq: $userID } }
    ) {
      aggregate {
        count
      }
    }
    related: dataset_related(
      where: { created_by: { _eq: $userID } }
      order_by: { created_at: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      created_at
      title
      url
      score: points_aggregate {
        aggregate {
          sum {
            point
          }
        }
      }
      dataset {
        id
        name
      }
    }
  }
`;

function getColor(point: Number): string {
  if (point > 0) {
    return 'text-green-500';
  }
  if (point < 0) {
    return 'text-rose-500';
  }
  return '';
}

function getIcon(point: Number) {
  if (point > 0) {
    return <Check />;
  }
  if (point < 0) {
    return <Stop />;
  }
  return <></>;
}
