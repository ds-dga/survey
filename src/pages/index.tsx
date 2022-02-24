import { useSession } from "next-auth/react"
import { Meta } from "@/layout/Meta"
import { Main } from "@/templates/Main"
import Item from "@/components/item"

const Index = () => {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const item = {
    category: "เศรษฐกิจ การเงินและอุตสาหกรรม",
    title: "ข้อมูลค่าจ้างตามมาตรการการใช้แรงงาน",
    latestVoted: "โหวตล่าสุด 4 วันก่อน",
    vote: {
      up: 104,
      down: 6,
    },
    comments: [],
    related: [
      {
        title: "ค่าจ้างแรงงานภาคธุรกิจบริการ/ท่องเที่ยว",
        source: "กลุ่มสถิติ แรงงาน กองสถิติสังคม",
        vote: {
          up: 3,
          down: 1,
        },
        comments: [],
      },
    ],
    organizations: [
      {
        title: "กลุ่มสถิติ แรงงาน กองสถิติสังคม/ท่องเที่ยว",
        vote: {
          up: 3,
          down: 1,
        },
        comments: [],
      },
    ],
  }

  console.log("Indexpage: session =", loading, session)

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {/* <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"> */}
      {session && (
        <>
          <h1>
            {session.user.name} {session.user.email} {session.user.image}
          </h1>
        </>
      )}
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 mb-20">
        <Item item={item} />
        <Item item={item} />
        <Item item={item} />
      </div>
    </Main>
  )
}

export default Index
