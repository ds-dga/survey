// icon:check2-square | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from 'react';

function Check(props: any) {
  const { fill, ...extraProps } = props;
  return (
    <svg
      fill={`${fill || 'currentColor'}`}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...extraProps}
    >
      <path
        fillRule="evenodd"
        d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
      />
      <path
        fillRule="evenodd"
        d="M10.97 4.97a.75.75 0 011.071 1.05l-3.992 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 01.02-.022z"
      />
    </svg>
  );
}

export default Check;
