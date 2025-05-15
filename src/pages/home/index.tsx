"use client";

import { useEffect, useState } from "react";
import HomeCarousel from "@/components/molecules/home/HomeCarousel";
import HomeFullScreenCarousel from "@/components/molecules/home/HomeFullScreenCarousel";
import Introduce from "@/components/organisms/introduce/Introduce";
import SuccessLoginModal from "../auth/login-modal";

const HomePage: React.FC = () => {
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
    <div>
      <SuccessLoginModal
        open={showModal}
        userId={userId || ""}
        onClose={() => setShowModal(false)}
      />

      <HomeFullScreenCarousel />

      <div className="text-center text-3xl font-semibold mt-10 text-purple-400">
        Top thiết kế tuần
      </div>

      <HomeCarousel />
      <Introduce />
    </div>
  );
};

export default HomePage;
