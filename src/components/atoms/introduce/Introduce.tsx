interface IntroduceProps {
  title: string;
  description: string,
  img: string
}
const Introduce = ({ title, description,img }: IntroduceProps) => {

  return (
    <div>
      <div className="grid xl:grid-cols-12 md:grid-cols-1 items-center gap-4">
        <div className="col-span-5">
          <div className="text-3xl font-semibold">
            {title}
          </div>
          <div>
            {description}
          </div>
        </div>
        <div className="col-span-7 md:grid-cols-12">
          <img src={img} className="w-full" alt={title} />
        </div>
      </div>
    </div>
  )
}

export default Introduce