import Image from "@/components/atoms/general/about/Image";

export function HeaderBanner() {
  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg mb-8">
      <Image
        src="/images/header-banner.png"
        alt="Creative Header Banner"
        // fill
        className="object-cover"
        // priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
