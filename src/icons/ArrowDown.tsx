import * as React from 'react';

export default function ArrowDown(props: any) {
  // https://reactsvgicons.com/search?q=email
  const { fill, ...extraProps } = props;
  return (
    <svg
      viewBox="0 0 512 512"
      fill={`${fill || 'currentColor'}`}
      height="1em"
      width="1em"
      {...extraProps}
    >
      <path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" />
    </svg>
  );
}
