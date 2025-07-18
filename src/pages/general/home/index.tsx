"use client";
import { useEffect, useState } from "react";
// import HomeCarousel from "@/components/molecules/general/home/HomeCarousel";
// import Introduce from "@/components/organisms/introduce/Introduce";
// import HomeTemplate from "@/components/templates/home/HomeTemplate";
import SuccessLoginModal from "@/pages/auth/login-modal";
import AnimatedLandingPage from "@/components/templates/home/AnimatedLandingPage";

const HomePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) {
      setUserId(user);
      setShowModal(true);
    }
  }, []);

  return (
    <div className="">
      <SuccessLoginModal
        open={showModal}
        userId={userId || ""}
        onClose={() => setShowModal(false)}
      />
      {/* <HomeTemplate /> */}
      <AnimatedLandingPage />
      {/* <div className="text-center text-3xl font-semibold mt-10 text-purple-400">
        Top thiết kế tuần
      </div> */}
      {/* <HomeCarousel />
      <Introduce /> */}
    </div>
  );
};

export default HomePage;
