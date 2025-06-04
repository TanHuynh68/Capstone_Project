import Image from "@/components/atoms/general/about/Image";

export function HeaderBanner() {
  return (
    <div className="relative w-full h-32 md:h-40 lg:h-48 overflow-hidden rounded-lg mb-8">
      <Image
        src="/images/header-banner.png"
        alt="Creative Header Banner"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
