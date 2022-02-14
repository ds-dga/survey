// icon:x-square | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from 'react';

function Stop(props: any) {
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
        stroke={`${fill || 'currentColor'}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 11l6-6m0 6L5 5"
      />
    </svg>
  );
}

export default Stop;
