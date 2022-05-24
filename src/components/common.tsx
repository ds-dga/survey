import ThumbDown from "@/icons/ThumbDown";
import ThumbUp from "@/icons/ThumbUp";



 function getColor(point: Number): string {
  if (point > 0) {
    return 'text-green-500';
  }
  if (point < 0) {
    return 'text-rose-500';
  }
  return '';
}

 function getArrow(point: Number) {
  if (point > 0) {
    return <ThumbUp />;
    // return <ArrowUp />;
  }
  if (point < 0) {
    return <ThumbDown />;
    // return <ArrowDown />;
  }
  return <p>-</p>;
}


export { getColor, getArrow}