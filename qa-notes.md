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

Controls của Streamdown đã được tắt ở cấp component, loại bỏ các nút copy/download trên code block và table. Mỗi code block được đặt margin trên/dưới đồng đều 1.65rem, còn pre bên trong giữ margin 0 để không tạo spacer riêng. Table chuyển sang `display: table` với `width: max-content` và `max-width: 100%`, loại bỏ vùng rỗng kéo ngang mà vẫn không tràn khung đọc.

Theo ảnh đánh dấu, spacing bên ngoài của toàn bộ khung code đã được tăng lên 2.25rem để paragraph không sát khung. Bên trong khung, vùng header/footer được nén bằng `gap: 0`, padding nhỏ ở phần language label và padding code 1.1rem × 1.5rem; nhờ vậy code vẫn có khoảng thở nhưng khung không còn cao dư.

Nguyên nhân lần trước là selector `data-streamdown="code-block"` nằm ở lớp nội dung, không phải wrapper tạo header trắng. CSS đã chuyển sang `data-code-block-container` cho margin bên ngoài và dùng `data-code-block-header`/`data-code-block` để nén header cùng vùng code bên trong. Nhờ đó spacer đỏ trong ảnh bị loại bỏ, còn paragraph phía dưới có khoảng cách thực từ toàn bộ khung code.

Margin ngoài của code block đã được hạ từ 2.25rem xuống 1.85rem. Khoảng này vẫn tạo một nhịp phân tách rõ với text trước/sau nhưng tránh cảm giác cao và rời rạc.

Các nhãn section được chuyển sang phần tử định vị ở mép phải heading. Desktop và mobile đều giữ heading ở phía trái thoáng, trong khi NOTE/READ/PRACTICE/TAKEAWAY nằm gọn ở phía phải mà không đẩy nội dung chính lệch bố cục.

Các heading và horizontal rule bên trong `.lesson-prose` đã bỏ đường phân cách. Khoảng cách dọc của heading được giữ lại để các phần vẫn có thứ bậc rõ, nhưng không còn cảm giác bị chia thành nhiều ô ngang.

## GitHub Pages deployment

Workflow đã build thành công nhưng bước deploy trả về `Not Found` vì GitHub Pages chưa được bật cho repository. GitHub API và trình duyệt sandbox không có quyền đăng nhập/quản trị repo, nên việc chọn nguồn GitHub Actions cần người dùng thực hiện trong Settings → Pages.

Giải pháp cuối cùng dùng nguồn legacy đang bật: static build có base `/prj301-study-hub/` đã được chép vào root của nhánh `main`, kèm `.nojekyll`. GitHub Pages chuyển sang `built`; URL `https://tranvotiendo.github.io/prj301-study-hub/` đã được kiểm tra trực tiếp và hiển thị trang học đầy đủ.
