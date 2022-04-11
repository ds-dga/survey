import * as React from 'react';

export default function LinkIcon(props: any) {
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
      <path d="M208,352H144a96,96,0,0,1,0-192h64" />
      <path d="M304,160h64a96,96,0,0,1,0,192H304" />
      <line x1="163.29" y1="256" x2="350.71" y2="256" />
    </svg>
  );
}
