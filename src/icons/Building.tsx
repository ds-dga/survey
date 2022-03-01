// icon:office-building-outline | Material Design Icons https://materialdesignicons.com/ | Austin Andrews
import * as React from 'react';

function BuildingIcon(props: any) {
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
      <path d="M19 3v18h-6v-3.5h-2V21H5V3h14m-4 4h2V5h-2v2m-4 0h2V5h-2v2M7 7h2V5H7v2m8 4h2V9h-2v2m-4 0h2V9h-2v2m-4 0h2V9H7v2m8 4h2v-2h-2v2m-4 0h2v-2h-2v2m-4 0h2v-2H7v2m8 4h2v-2h-2v2m-8 0h2v-2H7v2M21 1H3v22h18V1z" />
    </svg>
  );
}

export default BuildingIcon;
