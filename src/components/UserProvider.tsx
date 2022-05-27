import { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';

export type UserProviderType = {
  id: string | null;
  name: string | null;
  role: string | null;
  loading: boolean;
};

export default function UserProvider(): UserProviderType {
  const { data: session, status } = useSession();
  const [State, SetState] = useState<UserProviderType>({
    id: null,
    name: null,
    role: null,
    loading: true,
  });
  const { data } = useQuery(USER_QUERY, {
    variables: { ID: session?.user.uid },
    skip: status !== 'authenticated',
  });
  useEffect(() => {
    if (status === 'unauthenticated') {
      SetState({
        id: null,
        name: null,
        role: null,
        loading: false,
      });
      return;
    }
    if (data) {
      const u = data.item;
      SetState({
        id: u.id,
        name: u.name,
        role: u.roles.length > 0 ? u.roles[0].role : '',
        loading: false,
      });
    }
  }, [data]);

  // useEffect(() => {
  //   if (state.id !== null) return;
  //   let n = {
  //     ...state,
  //     loading,
  //   };
  //   if (data) {
  //     const u = data.item;
  //     n = {
  //       ...n,
  //       ...u,
  //       hidden: u.extras ? u.extras.hidden : [],
  //       accountType: u.extras ? u.extras.accountType : null,
  //     };
  //   }
  //   if (n.id !== null) setState(n);
  // }, [data, loading, state]);

  return State;
}

export const USER_QUERY = gql`
  query USER_QUERY($ID: uuid!) {
    item: users_by_pk(id: $ID) {
      id
      name
      email
      roles {
        role
      }
    }
  }
`;
