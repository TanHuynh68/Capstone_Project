import { useSelector } from "react-redux";
import DesignerTimeline from "@/components/organisms/timeline/DesignerTimeline";
import { RootState } from "@/redux/store";

export default function DesignerTimelinePage() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="container mx-auto px-12 py-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Lịch trình của nhà thiết kế
        </h1>
        <p className="text-gray-600 mt-2">
          Xem lịch trình và tiến độ các đơn hàng của bạn
        </p>
      </div>

      <DesignerTimeline designerID={user?.id} className="w-full" />
    </div>
  );
}
