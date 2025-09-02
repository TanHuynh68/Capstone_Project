export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-center mb-8">
            Điều khoản và Điều kiện
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>

          {/* Account Management */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              1. Quản lý Tài khoản
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">1.1 Xác thực Tài khoản</h3>
                <p>
                  Người dùng phải xác thực email để kích hoạt tài khoản của họ.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">1.2 Địa chỉ</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Mỗi tài khoản chỉ có thể lưu tối đa 3 địa chỉ</li>
                  <li>Chỉ có một địa chỉ chính</li>
                  <li>
                    Phải có 1 địa chỉ chính cho mỗi tài khoản, không thể xóa
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">1.3 Email và OTP</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Email phải là duy nhất cho tất cả người dùng của mỗi vai trò
                  </li>
                  <li>Khách hàng sẽ nhận OTP cũ nếu OTP đó chưa hết hạn</li>
                  <li>
                    Email nhân viên không được đăng ký với vai trò khác trước đó
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Post Management */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              2. Quản lý Bài đăng
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">2.1 Tạo Bài đăng</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Khách hàng không thể tạo bài đăng mới khi có 3 bài đăng đang
                    hoạt động và ở trạng thái "chưa nhận"
                  </li>
                  <li>
                    Giới hạn bài đăng tối đa có thể bị ảnh hưởng bởi mức độ uy
                    tín
                  </li>
                  <li>
                    Bài đăng sẽ có 7 ngày hoạt động trước khi tự động bị vô hiệu
                    hóa
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">2.2 Xóa và Vô hiệu hóa</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Chỉ các bài đăng ở trạng thái "chưa nhận" mới có thể bị xóa
                  </li>
                  <li>
                    Chỉ các bài đăng không có đề xuất nào mới có thể bị xóa
                  </li>
                  <li>
                    Chỉ các bài đăng không có đề xuất nào mới có thể bị vô hiệu
                    hóa
                  </li>
                  <li>Bài đăng không thể bị vô hiệu hóa nếu có đề xuất</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">2.3 Kích hoạt và Đăng lại</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Chỉ các bài đăng bị vô hiệu hóa mới có thể được kích hoạt
                  </li>
                  <li>
                    Chỉ các bài đăng bị vô hiệu hóa mới có thể được đăng lại
                  </li>
                  <li>
                    Chỉ các bài đăng không có đề xuất nào mới có thể được đăng
                    lại
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Offers and Orders */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              3. Đề xuất và Đơn hàng
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">3.1 Đề xuất</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Nhà thiết kế chỉ có thể đề xuất một lần trong một bài đăng
                  </li>
                  <li>
                    Khách hàng không tạo bài đăng không thể xem đề xuất trong
                    bài đăng đó
                  </li>
                  <li>
                    Đề xuất chỉ có thể bị xóa nếu trạng thái là đang chờ hoặc bị
                    từ chối
                  </li>
                  <li>
                    Đề xuất chỉ có thể được chỉnh sửa nếu trạng thái là đang chờ
                    hoặc bị từ chối
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">3.2 Đơn hàng</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Đơn hàng phải được tạo để tạo tiến trình đơn hàng</li>
                  <li>
                    Đơn hàng phải hoàn thành trước khi người dùng có thể tạo
                    phản hồi
                  </li>
                  <li>
                    Đơn hàng phải được giao trước khi khách hàng đặt cọc cho
                    giai đoạn đề xuất
                  </li>
                  <li>Đơn hàng phải được đặt cọc trước khi rút tiền</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">3.3 Giao hàng</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Nếu đơn hàng có đơn giao hàng đang xử lý, không thể tạo đơn
                    giao hàng mới
                  </li>
                  <li>
                    Chỉ người gửi và người nhận của đơn giao hàng mới có thể xem
                    chi tiết của nó
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Financial Transactions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              4. Giao dịch Tài chính
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">4.1 Ví và Giao dịch</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Người dùng chỉ có thể xem giao dịch của ví riêng và ví phải
                    tồn tại
                  </li>
                  <li>
                    Người dùng chỉ có thể xem đơn thanh toán liên kết với ví
                    riêng của họ
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">4.2 Thông tin Ngân hàng</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Tên ngân hàng phải khớp với danh sách các ngân hàng hoạt
                    động tại Việt Nam
                  </li>
                  <li>
                    Tên chủ tài khoản phải khớp với thông tin tên trong hồ sơ
                  </li>
                  <li>Thông tin ngân hàng của người dùng phải đầy đủ</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">4.3 Số tiền và QR Code</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Số tiền tối thiểu là 1.000 và phải chia hết cho 1.000</li>
                  <li>
                    Số tiền tối thiểu là 200.000 và phải chia hết cho 1.000
                  </li>
                  <li>
                    Mã QR phải được hiển thị, nếu mã QR không chính xác, một QR
                    thanh toán mới sẽ được tạo để thực hiện rút tiền
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Communication and Feedback */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              5. Giao tiếp và Phản hồi
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">5.1 Tin nhắn</h3>
                <p>
                  Cả hai người dùng phải ở trong cùng một phòng chat để nhắn tin
                  cho nhau.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">5.2 Phản hồi</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Phản hồi phải được tạo trước khi có thể được xem</li>
                  <li>Phản hồi phải được tạo trước khi có thể được trả lời</li>
                  <li>
                    Cả khách hàng và nhà thiết kế cần chấp nhận để xác nhận
                    thành công
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Design and Portfolio */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              6. Thiết kế và Portfolio
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">6.1 Portfolio</h3>
                <p>
                  Nhà thiết kế chỉ có thể tạo một portfolio cho mỗi tài khoản.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">6.2 Canvas và Thư mục</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Người dùng phải tạo ít nhất một canvas thiết kế để tự động
                    tạo thư mục
                  </li>
                  <li>Thư mục canvas phải được tạo trước để có thể cập nhật</li>
                  <li>Thư mục canvas phải được tạo trước để có thể xóa</li>
                  <li>Canvas phải được tạo trước để có thể cập nhật</li>
                  <li>Canvas phải được tạo trước để có thể sao chép</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">6.3 Giai đoạn Đề xuất</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Đề xuất phải được tạo để giai đoạn đề xuất được tạo</li>
                  <li>
                    Giai đoạn đề xuất phải được tạo trước khi có thể được xem
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits and System */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              7. Lợi ích và Hệ thống
            </h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p>
                Nếu có lợi ích cũ có loại và tiêu đề tương tự, vô hiệu hóa lợi
                ích cũ trước và sau đó tạo lợi ích mới.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Liên hệ</h2>
            <p className="text-muted-foreground">
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản và điều kiện này,
              vui lòng liên hệ với chúng tôi qua email hoặc thông qua hệ thống
              hỗ trợ.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
