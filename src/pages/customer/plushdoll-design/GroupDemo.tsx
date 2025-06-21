import React from "react";

const GroupDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tính năng Group/Ungroup</h1>

      <div className="space-y-6">
        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Cách sử dụng:</h2>
          <div className="space-y-2 text-sm">
            <p>
              • <strong>Chọn nhiều đối tượng:</strong> Giữ Ctrl (hoặc Cmd trên
              Mac) và click vào các đối tượng muốn nhóm
            </p>
            <p>
              • <strong>Nhóm đối tượng:</strong> Nhấn Ctrl+G hoặc click nút
              "Nhóm" trong sidebar
            </p>
            <p>
              • <strong>Tách nhóm:</strong> Chọn nhóm và nhấn Ctrl+Shift+G hoặc
              click nút "Tách nhóm"
            </p>
            <p>
              • <strong>Phím tắt:</strong> Ctrl+A để chọn tất cả, Ctrl+C để
              copy, Ctrl+V để paste
            </p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Lợi ích:</h2>
          <div className="space-y-2 text-sm">
            <p>
              • <strong>Tổ chức:</strong> Nhóm các đối tượng liên quan để dễ
              quản lý
            </p>
            <p>
              • <strong>Di chuyển:</strong> Di chuyển nhiều đối tượng cùng lúc
            </p>
            <p>
              • <strong>Copy/Paste:</strong> Sao chép và dán nhóm đối tượng
            </p>
            <p>
              • <strong>Transform:</strong> Thay đổi kích thước, xoay nhóm đối
              tượng
            </p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">Lưu ý:</h2>
          <div className="space-y-2 text-sm">
            <p>• Cần chọn ít nhất 2 đối tượng để có thể nhóm</p>
            <p>• Chỉ có thể tách nhóm khi đã chọn một nhóm</p>
            <p>
              • Các nút Group/Ungroup sẽ tự động ẩn/hiện tùy theo trạng thái
              selection
            </p>
            <p>• Nhóm đối tượng sẽ được lưu cùng với thiết kế</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDemo;
