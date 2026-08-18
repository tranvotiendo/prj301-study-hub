# Ghi chú kiểm tra trực quan

- Bố cục desktop hiển thị đúng mô hình bàn đọc ba vùng: mục lục, bài Markdown, Study Desk.
- Nội dung PRJ301 được render liên tục với heading, bảng, code block và quote có style chuyên biệt.
- Dấu hiệu thương hiệu `/PRJ301`, biểu tượng giấy gấp và motif request–response đã xuất hiện ở lockup, session marker và lesson opening.
- Không phát hiện lỗi TypeScript hoặc lỗi hiển thị rõ ràng trong lần kiểm tra trực quan sau cập nhật.

## Phản hồi thương hiệu và tương phản

Người dùng yêu cầu thay logo hiện tại bằng ảnh nhân vật họ cung cấp. Asset đã được lưu dưới dạng `prj301-user-logo.png` và `.webp` trong thư mục asset web. Vấn đề hiển thị cần xử lý là code block nền quá sáng so với màu chữ, đặc biệt ở ảnh minh hoạ luồng request–response; các khối code sẽ được chuyển sang nền navy đậm và chữ sáng, với viền teal rõ ràng.

Đã xác nhận ở desktop và mobile: logo mới hiển thị gọn trong header; thông tin trong phần bài học giữ độ tương phản rõ trên nền giấy ấm. Code block đã được ép dùng nền navy đậm, chữ gần trắng và opacity đầy đủ để tránh bị nhạt bởi theme của bộ render Markdown.

Lượt tinh chỉnh cuối đã chuyển layout ở chế độ tập trung từ lưới ba cột sang khối đơn có chiều rộng tối đa 61rem và margin tự động hai bên. Vì vậy, khi hai sidebar bị ẩn, phần bài học vẫn cân giữa vùng nhìn thay vì kế thừa cột chính nằm lệch trong grid cũ. Logo được crop tròn, giữ đúng tỉ lệ ảnh và đã kiểm tra hiển thị ở desktop/mobile.
