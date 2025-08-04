import { memo } from "react";

const MapSection = memo(function MapSection() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-border h-[300px] md:h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75031.09194600265!2d106.67663954251219!3d10.81702337696593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e1!3m2!1sen!2s!4v1754258887917!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="DollCraft Location"
      ></iframe>
    </div>
  );
});

export default MapSection;
