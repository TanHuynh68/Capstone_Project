import { useEffect, useRef, useState } from "react";
import LoginImage from "../login/LoginImage";

const RegisterVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      videoRef.current.playbackRate = 0.75; // Slow down video slightly
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
        setVideoError(true);
      });
    }
  }, [videoError]);

  if (videoError) {
    return <LoginImage />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        onError={() => setVideoError(true)}
      >
        <source src="/video/labubu-register.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/20" /> Optional overlay
    </div>
  );
};

export default RegisterVideo;
