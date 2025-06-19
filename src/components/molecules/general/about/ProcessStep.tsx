import Heading from "@/components/atoms/general/about/Heading";
import Paragraph from "@/components/atoms/general/about/Paragraph";
import Image from "@/components/atoms/general/about/Image";

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
}

export default function ProcessStep({
  number,
  title,
  description,
  imageSrc,
}: ProcessStepProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-1 order-2 md:order-1">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-3">
            {number}
          </div>
          <Heading level={3} className="text-xl m-0 text-foreground font-bold">
            {title}
          </Heading>
        </div>
        <Paragraph className="text-muted-foreground">{description}</Paragraph>
      </div>
      <div className="flex-1 order-1 md:order-2">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full"
        />
      </div>
    </div>
  );
}
