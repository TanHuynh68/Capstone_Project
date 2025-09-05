import { memo } from "react";

const MapSection = memo(function MapSection() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-border h-[800px] md:h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42864.042174530885!2d106.69732801146837!3d10.811453434226356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2fd3115171%3A0x4f30622a65dde040!2zNzcgVHLhuqduIFF14buRYyBUaOG6o28sIFBoxrDhu51uZyBWw7UgVGjhu4sgU8OhdSwgUXXhuq1uIDMsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e1!3m2!1sen!2s!4v1757023571295!5m2!1sen!2s"
        width="600"
        height="450"
        className="w-full"
        loading="lazy"
      ></iframe>
    </div>
  );
});

export default MapSection;
