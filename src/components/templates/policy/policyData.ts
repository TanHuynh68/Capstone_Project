export const policyData: PolicyCategory[] = [
    {
        id: "general",
        name: "CHUNG",
        rules: [
            {
                id: "complete-on-time",
                category: "general",
                scenario: "Hoàn thành đơn đúng hạn",
                description: "Dự án hoàn thành đúng tiến độ và đạt chất lượng",
                customerScore: 10,
                designerScore: 10,
                customerCompensation: 0,
                designCompensation: 90
            },
            {
                id: "customer-cancel",
                category: "general",
                scenario: "Hủy đơn do khách thay đổi ý định (trước khi bắt đầu)",
                description: "Khách hủy sau khi đơn hàng được tạo nhưng chưa giao sản phẩm CREATED => CONFLICT",
                customerScore: -5,
                designerScore: 0,
                customerCompensation: 0,
                designCompensation: 100
            },
            {
                id: "designer-cancel",
                category: "general",
                scenario: "Hủy đơn do Designer không thể thực hiện (trước khi bắt đầu)",
                description: "Nhà thiết kế hủy đơn sau khi nhận nhưng chưa thực hiện gì INPROGRESS => CONFLICT",
                customerScore: 0,
                designerScore: -5,
                customerCompensation: 50,
                designCompensation: 50
            }
        ]
    },
    {
        id: "delivery",
        name: "GIAO HÀNG",
        rules: [
            {
                id: "customer-late-delivery",
                category: "delivery",
                scenario: "Khách hàng giao hàng trễ hạn",
                description: "Khách hàng không giao sản phẩm đúng thời gian đã thống nhất, ảnh hưởng đến tiến độ thực hiện của nhà thiết kế. Ko cho nos giao => huyhuydon",
                customerScore: -10,
                designerScore: 0,
                customerCompensation: 0,
                designCompensation: 100
            },
            {
                id: "designer-late-delivery",
                category: "delivery",
                scenario: "Nhà thiết kế giao hàng trễ hạn",
                description: "Nhà thiết kế giao trả sản phẩm chậm hơn thời gian đã cam kết CUS-REJECT => REJECTED",
                customerScore: 0,
                designerScore: -10,
                customerCompensation: 10,
                designCompensation: 80
            },
            {
                id: "designer-late-delivery-2",
                category: "delivery",
                scenario: "Nhà thiết kế giao hàng trễ hạn",
                description: "Nhà thiết kế giao trả sản phẩm chậm hơn thời gian đã cam kết CUS-REJECT => REJECTED",
                customerScore: 0,
                designerScore: -10,
                customerCompensation: 10,
                designCompensation: 80
            },
            {
                id: "customer-wrong-product",
                category: "delivery",
                scenario: "Khách hàng giao sản phẩm không đúng với mô tả",
                description: "Khách hàng giao sản phẩm không đúng với mô tả trước khi thực hiện DES-REJECT => REJECTED",
                customerScore: -10,
                designerScore: 0,
                customerCompensation: 0,
                designCompensation: 100
            },
            {
                id: "designer-wrong-product",
                category: "delivery",
                scenario: "Nhà thiết kế giao sản phẩm không đúng với mô tả",
                description: "Sản phẩm nhà thiết kế giao không đúng với mô tả, không theo yêu cầu sau khi đã thực hiện CUS-REJECT => REJECTED",
                customerScore: 10,
                designerScore: -20,
                customerCompensation: 90,
                designCompensation: -100
            }
        ]
    },
    {
        id: "order-progress",
        name: "ĐƠN HÀNG & TIẾN ĐỘ",
        rules: [
            {
                id: "customer-wrong-info",
                category: "order-progress",
                scenario: "Khách hàng báo sai khi nhà thiết kế làm đúng",
                description: "Nhà thiết kế đã thực hiện đúng tiến độ và chất lượng nhưng khách hàng có tình đánh giá sai, ảnh hưởng đến nhà thiết kế",
                customerScore: -10,
                designerScore: 5,
                customerCompensation: 90,
                designCompensation: 90
            },
            {
                id: "designer-multiple-mistakes",
                category: "order-progress",
                scenario: "Nhà thiết kế liên tục làm sai và không cải thiện",
                description: "Nhà thiết kế làm các giai đoạn không đạt yêu cầu nhiều lần, gây gián đoạn tiến độ và lãng phí",
                customerScore: 5,
                designerScore: -10,
                customerCompensation: 100,
                designCompensation: 50
            }
        ]
    }
];
