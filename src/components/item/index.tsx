import { useState } from "react"

import Link from "next/link"
import { useRouter } from "next/router"

import ChatBubble from "@/icons/ChatBubble"
import LinkIcon from "@/icons/LinkIcon"
import { displayDatetime } from "@/libs/day"

import CommentList from "./comment"
import CommentForm from "./commentForm"
import Provider from "./provider"
import Related from "./related"
import VoteInline from "./vote-inline"

export default function Item({ item, commentTotal }: any) {
  const router = useRouter()
  const [showComment, SetShowComment] = useState(false)
  const moded = {
    ...item,
    vote: { up: 0, down: 0, latest: null, mine: 0 },
    comments: [],
  }
  if (item.points.length > 0) {
    moded.vote.up = item.vote_up.aggregate.sum.point
    moded.vote.down = item.vote_down.aggregate.sum.point
    moded.vote.latest = item.points[0].created_at
  }
  if (item.my_vote.length > 0) {
    moded.vote.mine = item.my_vote[0].point
  }
  const detailView = router.pathname === "/n/[ID]"

  return (
    <div className="group relative rounded-md shadow-md border-2 border-slate-50 bg-slate-50 pb-3 px-5">
      {!detailView && (
        <span className="float-right">
          <Link passHref href={`/n/${moded.id}`}>
            <div className="text text-gray-500 mt-1 zmax-w-2xl text-sm cursor-pointer">
              <LinkIcon className="inline" fill={"#10b981"} />
              #[permanent link]
            </div>
          </Link>
        </span>
      )}
      <div className="pt-3 flex gap-3">
        {/* <Vote datasetID={moded.id} initialValue={moded.vote} /> */}
        <div>
          <Link href={`/category/${moded.category.id}`} passHref>
            <span className="mt-1 zmax-w-2xl text-sm text-gray-500 cursor-pointer">
              {moded.category.name}
            </span>
          </Link>
          <h3 className="text-xl leading-6 font-medium text-gray-900">
            {moded.name}
          </h3>
        </div>
      </div>
      {/* <div className="flex justify-between"> */}
      <div className="text-sm text-gray-500 flex">
        <VoteInline datasetID={moded.id} initialValue={moded.vote} />
        &nbsp;|&nbsp;
        <span className="px-1">
        {moded.vote.latest ? `${displayDatetime(moded.vote.latest)} | ` : ""}
        </span>
        {/* {moded.vote.up || 0} โหวต{" "}
        <ArrowUp className="inline" fill={"#10b981"} />{" "}
        {Math.abs(moded.vote.down) || 0} โหวต{" "}
        <ArrowDown className="inline" fill={"#fb7185"} />{" "} */}
        {commentTotal && (
          <button
            className="text-sm font-medium text-sky-500"
            onClick={() => {
              SetShowComment(!showComment)
            }}
          >
            {commentTotal.aggregate.count} ความเห็น{" "}
            <ChatBubble className="inline text-xl" />
          </button>
        )}
      </div>
      {/* </div> */}

      <CommentForm hidden={!showComment} />
      {showComment && <CommentList toggleVisibility={SetShowComment} />}

      <div className="mt-5 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
        <div className="relative border-l-4 border-green-400 pl-2">
          <Related items={moded.related} datasetID={moded.id} />
        </div>

        <div className="relative border-l-4 border-pink-400 pl-2">
          <Provider orgs={moded.providers} datasetID={moded.id} />
        </div>
      </div>
    </div>
  )
}
