
interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function Image({ src, alt, width, height, className = "" }: ImageProps) {
  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width || 500}
        height={height || 300}
        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
      />
    </div>
  )
}
