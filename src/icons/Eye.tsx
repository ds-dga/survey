// icon:check2-square | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from 'react';

export default function Eye(props: any) {
  const { fill, ...extraProps } = props;
  return (
    <svg
      fill={`${fill || 'currentColor'}`}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...extraProps}
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );
}
