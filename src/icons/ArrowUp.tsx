import * as React from 'react';

export default function ArrowUp(props: any) {
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
      <path d="M414 321.94L274.22 158.82a24 24 0 00-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" />
    </svg>
  );
}
