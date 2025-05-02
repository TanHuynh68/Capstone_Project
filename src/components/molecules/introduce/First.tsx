import Introduce from "@/components/atoms/introduce/Introduce"
import first from '@/assets/first.png';
const First = () => {
    return (
        <div>
            <Introduce
                title="Lên ý tưởng & chọn họa sĩ mà bạn yêu thích"
                description="Phác họa và tìm kiếm họa sĩ phù hợp với cá tính của bạn "
                img={first}
            />
        </div>
    )
}

export default First