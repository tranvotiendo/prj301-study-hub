# Cập nhật theo phản hồi giao diện

- [x] Thay logo hiện tại bằng hình người dùng cung cấp và kiểm tra kích thước hiển thị.
- [x] Điều chỉnh nền, màu chữ và viền của code block để đảm bảo độ tương phản cao.
- [x] Rà soát các khung Markdown có nền sáng để loại bỏ chữ bị chìm.
- [x] Kiểm tra lại trên desktop và mobile trước khi bàn giao.

## Tinh chỉnh chế độ tập trung

- [x] Căn giữa cột bài học khi ẩn hai sidebar trong chế độ tập trung.
- [x] Chuyển logo người dùng chọn sang avatar tròn, không méo hình.
- [x] Kiểm tra lại giao diện tập trung trên desktop và mobile.

## Thư viện Markdown nhiều tài liệu

- [x] Bỏ bóng trang trí phía sau logo tròn.
- [x] Tạo file cấu hình để người dùng thêm sẵn nhiều Markdown trong mã nguồn.
- [x] Hiển thị thư viện tài liệu và cho phép chuyển qua lại giữa các file Markdown đã cấu hình.
- [x] Cho phép tải nhiều file Markdown trong một lần và thêm vào thư viện hiện tại, không thay thế tài liệu cũ.
- [x] Kiểm tra render nhiều tài liệu, desktop và mobile.

## Tối ưu trải nghiệm đọc

- [x] Mở rộng chiều ngang nội dung trong chế độ Focus.
- [x] Chuyển các nhãn sidebar và điều khiển cố định sang tiếng Anh.
- [x] Dùng font hệ thống an toàn cho các nhãn section và sidebar.
- [x] Đưa Key takeaways về kiểu chữ và cỡ chữ tương đương section thường.
- [x] Kiểm tra giao diện đọc sau khi cập nhật.

## Tinh chỉnh copy và code block

- [x] Chuyển headline hero sang tiếng Anh.
- [x] Thiết kế lại hiển thị tiến độ để phần trăm và badge không gây rối hoặc xuống dòng.
- [x] Loại bỏ khoảng trắng thừa quanh code block và tăng nội biên cho code dễ đọc.
- [x] Kiểm tra lại khối code cùng giao diện desktop/mobile.

## Tinh chỉnh code và bảng Markdown

- [x] Cân bằng khoảng cách trước/sau code block với đoạn văn lân cận.
- [x] Ẩn các nút copy/download do bộ render Markdown thêm vào code và bảng.
- [x] Xoá phần không gian ngang thừa của bảng, giữ kích thước vừa theo nội dung.
- [x] Kiểm tra lại render code và table trên desktop.

## Tinh chỉnh khoảng cách code block theo ảnh đánh dấu

- [x] Tăng khoảng cách giữa paragraph và toàn bộ khung code.
- [x] Giảm header/footer trắng dư bên trong khung code.
- [x] Xác nhận khung code gọn hơn mà không làm text sát mép.

## Sửa trực tiếp container code renderer

- [x] Xoá spacer trên/dưới bên trong wrapper của code block.
- [x] Đặt margin ngoài riêng giữa code block và paragraph kế tiếp.
- [x] Kiểm tra bằng ví dụ GET text trong tài liệu.

## Cân lại spacing code block

- [x] Giảm margin ngoài code block từ mức rộng xuống nhịp vừa phải.
- [x] Xác nhận text và code vẫn tách rõ nhưng không bị cao quá.

## Căn lại nhãn section

- [x] Đưa các nhãn READ, PRACTICE, TAKEAWAY và NOTE sang phải heading.
- [x] Giữ heading bên trái gọn và kiểm tra responsive trên mobile.

## Loại bỏ divider nội dung

- [x] Bỏ đường gạch trên các heading và horizontal rule trong Markdown.
- [x] Giữ khoảng cách dọc đủ rõ khi không còn divider.

## GitHub Pages deployment

- [ ] Xác nhận repository GitHub đích và trạng thái GitHub Pages.
- [ ] Thêm workflow build và deploy Pages khi push nhánh main.
- [ ] Xác minh workflow và hướng dẫn bật nguồn GitHub Pages nếu cần.

## Khắc phục GitHub Pages 404

- [ ] Kiểm tra Pages site đã được kích hoạt và URL triển khai thực tế.
- [ ] Kiểm tra kết quả workflow deploy gần nhất.
- [ ] Xác nhận đường dẫn GitHub Pages hoạt động sau khi khắc phục.

## Sửa router GitHub Pages

- [ ] Cấu hình Wouter base path theo `import.meta.env.BASE_URL`.
- [ ] Build với base `/prj301-study-hub/` và xác minh route gốc hiển thị Home.

## Fallback đơn trang cho GitHub Pages

- [ ] Render Home trực tiếp tại entry app thay vì phụ thuộc pathname của router.
- [ ] Xác minh URL GitHub Pages gốc không còn hiển thị NotFound.
