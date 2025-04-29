"use client"
import HomeCarousel from "@/components/molecules/home/HomeCarousel"
import HomeFullScreenCarousel from "@/components/molecules/home/HomeFullScreenCarousel"

const HomePage = () => {
  return (
    <div className="">
      <HomeFullScreenCarousel />
      <div className="text-center text-3xl font-semibold mt-10 text-purple-400">
        Top thiết kế tuần
      </div>
      <div >
        <HomeCarousel />
      </div>
    </div>
  )
}

export default HomePage

