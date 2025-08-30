export const statusDescriptions: Record<OrderStatus, string> = {
    Created: "Khách hàng cần gửi sản phẩm cần làm đến nhà thiết kế.",
    ShippingToDesigner:
        "Nhà thiết kế cần xác nhận sản phẩm có đúng với mô tả không. Nếu không đúng, có thể báo cáo.",
    DesignerRejected:
        "Nhà thiết kế đã từ chối. Đang chờ nhân viên xem xét đơn tố cáo để đưa ra hướng giải quyết.",
    InProgress:
        "Khách hàng cần thanh toán cho từng giai đoạn. Nhà thiết kế sẽ rút tiền để tiến hành làm. Sau mỗi giai đoạn, khách hàng cần đánh giá.",
    Completed:
        "Đơn đã hoàn thành. Nhà thiết kế cần giao sản phẩm đã hoàn thành cho khách hàng.",
    ShippingToCustomer:
        "Khách hàng cần xác nhận sản phẩm có đúng với mô tả không. Nếu không đúng, có thể báo cáo.",
    CustomerRejected:
        "Khách hàng đã từ chối. Đang chờ nhân viên xem xét đơn tố cáo để đưa ra hướng giải quyết.",
    Done: "Đơn hàng đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
    PendingConflict:
        "Đơn hàng đang xảy ra tranh chấp giữa 2 bên. Cần chờ nhân viên xem xét để đưa ra hướng giải quyết.",
    Rejected:
        "Đơn hàng đã bị hủy kèm quyền lợi. Xin lỗi vì trải nghiệm không được tốt này.",
    RequestShipToCus: "Đơn hàng đang chờ gửi đến khách hàng.",
};
