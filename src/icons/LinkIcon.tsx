import * as React from 'react';

export default function LinkIcon(props: any) {
  // https://reactsvgicons.com/search?q=email
  const { fill, ...extraProps } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={`${fill || 'currentColor'}`}
      height="1em"
      width="1em"
      {...extraProps}
    >
      <path d="M14.78 3.653a3.936 3.936 0 115.567 5.567l-3.627 3.627a3.936 3.936 0 01-5.88-.353.75.75 0 00-1.18.928 5.436 5.436 0 008.12.486l3.628-3.628a5.436 5.436 0 10-7.688-7.688l-3 3a.75.75 0 001.06 1.061l3-3z"></path>
      <path d="M7.28 11.153a3.936 3.936 0 015.88.353.75.75 0 001.18-.928 5.436 5.436 0 00-8.12-.486L2.592 13.72a5.436 5.436 0 107.688 7.688l3-3a.75.75 0 10-1.06-1.06l-3 3a3.936 3.936 0 01-5.567-5.568l3.627-3.627z"></path>
    </svg>
  );
}
