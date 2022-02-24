import { useState } from "react"
import ArrowDown from "@/icons/ArrowDown"
import ArrowUp from "@/icons/ArrowUp"
import Check from "@/icons/Check"
import Stop from "@/icons/Stop"
import CommentList from "./comment"
import CommentForm from "./commentForm"
import Vote from "./vote"

export default function Item({ item }: any) {
  const [showComment, SetShowComment] = useState(false)
  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 py-3 px-5">
      <div className="pt-3 flex gap-3">
        <Vote />
        <div>
          <p className="mt-1 zmax-w-2xl text-sm text-gray-500">
            {item.category}
          </p>
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {item.title}
          </h3>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          {/* <h3 className="text-sm text-gray-700">
          {item.vote.up} โหวต
          </h3> */}
          <div className="text-sm text-gray-500">
            {item.latestVoted} | {item.vote.up} โหวต{" "}
            <ArrowUp className="inline" fill={"#10b981"} /> {item.vote.down}{" "}
            โหวต <ArrowDown className="inline" fill={"#fb7185"} />
          </div>
        </div>
        <button
          className="text-sm font-medium text-gray-900"
          onClick={() => {
            SetShowComment(!showComment)
          }}
        >
          {item.comments.length} ความคิดเห็น
        </button>
      </div>

      <CommentForm hidden={!showComment} />
      {showComment && <CommentList />}

      <div className="mt-5 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
        <div className="relative border-l-4 border-green-400 pl-2">
          <div className="text-gray-600 italic">ข้อมูลที่ใกล้เคียง</div>
          {item.related.map((related: any, ind: number) => (
            <div className="flex gap-3" key={`${item.id}-related-${ind}`}>
              <div className="text-2xl min-w-fit">
                <Check className="inline" fill={"#10b981"} />{" "}
                <Stop className="inline" fill={"#fb7185"} />
              </div>
              <div>
                <div>{related.title}</div>
                <div className="text-md text-gray-600">by {related.source}</div>
                <div className="text-sm text-gray-500">
                  {related.vote.up - related.vote.down} โหวต{" "}
                  <Check className="inline" /> {related.comments.length}{" "}
                  ความคิดเห็น
                </div>

                <CommentForm hidden={!showComment} />
              </div>
            </div>
          ))}
        </div>

        <div className="relative border-l-4 border-pink-400 pl-2">
          <div className="text-gray-600 italic">หน่วยงานที่เปิดเผยข้อมูล</div>
          {item.organizations.map((org: any, ind: number) => (
            <div className="flex gap-3" key={`${item.id}-org-${ind}`}>
              <div className="text-2xl min-w-fit">
                <Check className="inline" fill={"#10b981"} />{" "}
                <Stop className="inline" fill={"#fb7185"} />
              </div>
              <div className="pt-2">{org.title}</div>
            </div>
          ))}
          <button
            type="button"
            className="mt-5 px-4 py-1 text-md rounded-full text-white hover:text-white hover:border-transparent focus:outline-none focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-400 hover:scale-105 ease-in-out duration-300"
          >
            เพิ่มหน่วยงานที่อยากให้เปิดข้อมูล
          </button>

          <CommentForm hidden={!showComment} />
        </div>
      </div>
    </div>
  )
}
