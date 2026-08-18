# Ghi chú kiểm tra trực quan

- Bố cục desktop hiển thị đúng mô hình bàn đọc ba vùng: mục lục, bài Markdown, Study Desk.
- Nội dung PRJ301 được render liên tục với heading, bảng, code block và quote có style chuyên biệt.
- Dấu hiệu thương hiệu `/PRJ301`, biểu tượng giấy gấp và motif request–response đã xuất hiện ở lockup, session marker và lesson opening.
- Không phát hiện lỗi TypeScript hoặc lỗi hiển thị rõ ràng trong lần kiểm tra trực quan sau cập nhật.

## Phản hồi thương hiệu và tương phản

Người dùng yêu cầu thay logo hiện tại bằng ảnh nhân vật họ cung cấp. Asset đã được lưu dưới dạng `prj301-user-logo.png` và `.webp` trong thư mục asset web. Vấn đề hiển thị cần xử lý là code block nền quá sáng so với màu chữ, đặc biệt ở ảnh minh hoạ luồng request–response; các khối code sẽ được chuyển sang nền navy đậm và chữ sáng, với viền teal rõ ràng.

Đã xác nhận ở desktop và mobile: logo mới hiển thị gọn trong header; thông tin trong phần bài học giữ độ tương phản rõ trên nền giấy ấm. Code block đã được ép dùng nền navy đậm, chữ gần trắng và opacity đầy đủ để tránh bị nhạt bởi theme của bộ render Markdown.

Lượt tinh chỉnh cuối đã chuyển layout ở chế độ tập trung từ lưới ba cột sang khối đơn có chiều rộng tối đa 61rem và margin tự động hai bên. Vì vậy, khi hai sidebar bị ẩn, phần bài học vẫn cân giữa vùng nhìn thay vì kế thừa cột chính nằm lệch trong grid cũ. Logo được crop tròn, giữ đúng tỉ lệ ảnh và đã kiểm tra hiển thị ở desktop/mobile.

Thư viện đa Markdown đã được đưa vào `client/src/content/library.ts`. Bộ nạp tự tìm tất cả file `.md` đặt trong `client/src/content/`; danh mục `documentCatalog` là nơi chỉnh tên hiển thị và thứ tự nếu cần. Nút “Thêm Markdown” nhận nhiều file cùng lúc và đưa tất cả vào thư viện đang mở, không xóa tài liệu cũ. Kiểm tra desktop/mobile xác nhận logo đã bỏ bóng và giao diện thư viện hiển thị đúng.

Chế độ Focus hiện mở rộng vùng bài học đến tối đa 100rem; phần nội dung Markdown dùng tối đa 82rem để đọc được nhiều theo chiều ngang khi cần. Sidebar và các nhãn UI cố định đã dùng tiếng Anh. Hệ thống font cho heading bài học và section chuyển sang system sans-serif có fallback; Key takeaways giờ dùng đúng style của heading cấp 2 thông thường.

Headline hero hiện dùng tiếng Anh: “Trace the request. Follow the data flow.” Progress được chuyển từ display serif sang sans-serif đậm, và badge `0/5 done` được ép một dòng. Code block đã bỏ toàn bộ margin bên ngoài, đồng thời tăng padding ngang/dọc để nội dung code không sát khung và không còn khoảng trống riêng giữa vùng code với khung render.
