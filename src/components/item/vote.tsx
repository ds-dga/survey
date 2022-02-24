import ArrowDown from "@/icons/ArrowDown"
import ArrowUp from "@/icons/ArrowUp"

export default function Vote() {
  const Action = "up"
  const Point = 3219
  return (
    <div className="text-2xl flex flex-col items-center">
      <div
        className={`${Action === "up" ? "up" : ""}`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "up" ? "-" : "up")
        }}
      >
        <ArrowUp fill={""} />
      </div>
      <div className={`text-center ${Action}`}>{Point}</div>
      <div
        className={`arrow down`}
        onClick={() => {
          // if (noActionAllowed) {
          //   alert(noActMsg)
          //   return
          // }
          // calcVote(Action === "down" ? "-" : "down")
        }}
      >
        <ArrowDown fill={""} />
      </div>
    </div>
  )
}
