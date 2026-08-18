# Định hướng thiết kế — PRJ301 Study Hub

## Ba hướng phong cách

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Kỹ thuật giấy ghi chú | Trải nghiệm như một sổ tay học kỹ thuật được biên tập kỹ: sáng, ấm, nhiều khoảng thở và có dấu vết của việc ghi chú. | 0.07 |
| Bảng điều khiển terminal | Lấy cảm hứng từ terminal và traffic HTTP, dùng nền tối cùng thông tin có cấu trúc để khơi gợi cảm giác thực hành. | 0.04 |
| Xưởng kiến thức Java | Một không gian học hiện đại, ánh sáng ấm, dùng khối nội dung như các “mô-đun” trong một xưởng phần mềm. | 0.09 |

## Hướng được chọn: Kỹ thuật giấy ghi chú

### Design Movement

Thiết kế kết hợp **editorial learning journal** với **technical documentation**. Giao diện lấy cảm giác một cuốn sổ ghi chú kỹ thuật được giảng viên biên tập, thay vì một dashboard học tập đại trà.

### Core Principles

1. **Đọc trước, thao tác sau:** Nội dung Markdown luôn là trung tâm; điều hướng và công cụ học đóng vai trò nền.
2. **Tín hiệu thị giác có mục đích:** Mỗi màu nhấn biểu đạt một loại thông tin—tiến độ, code, mẹo học—không chỉ để trang trí.
3. **Nhịp đọc rõ ràng:** Tiêu đề, câu hỏi, bảng, code block và takeaway có hình thức riêng để mắt quét nhanh.
4. **Tính cá nhân hóa nhẹ:** Trạng thái đã học, chế độ tập trung, tìm kiếm và tải Markdown biến tài liệu tĩnh thành không gian tự học.

### Color Philosophy

Nền **ivory ấm** mô phỏng giấy chất lượng tốt để giảm cảm giác chói của màn hình trong lúc đọc dài. Ink navy tạo độ tin cậy và tương phản cho nội dung chuyên môn; verde teal là tín hiệu tiến độ và hành động; cam terracotta dùng tiết chế để gọi sự chú ý đến câu hỏi và ý quan trọng. Màu sở hữu thương hiệu là **Notebook Teal `#0F766E`**.

### Layout Paradigm

Trên desktop, trang tổ chức thành một **bàn đọc ba vùng**: navigation rail bên trái như mục lục cuốn sổ, bài học ở giữa là tờ giấy chính, và “Study Desk” bên phải cho tiến độ/câu hỏi nhanh. Trên mobile, hai vùng phụ thu lại thành panel thao tác để ưu tiên một cột đọc.

### Signature Elements

1. Đường biên **rule line** mảnh màu xanh xám chạy sau tiêu đề và phân vùng như giấy kẻ kỹ thuật.
2. Nhãn **session tab** đứng đầu bài, mô phỏng thẻ đánh dấu trong tài liệu học.
3. Ký hiệu **mũi tên request–response** và điểm chấm cấu trúc, gợi luồng của web application.

### Interaction Philosophy

Tương tác luôn nhằm rút ngắn khoảng cách từ “đang đọc” đến “đang hiểu”: chọn session để cuộn ngay đến vị trí, đánh dấu hoàn thành để cập nhật tiến độ, tìm kiếm để lọc heading, và chọn file `.md` để chuyển bộ tài liệu. Các điều khiển giữ trạng thái địa phương trong trình duyệt.

### Animation

Chỉ dùng chuyển động nhỏ, tối đa 220 ms, với easing `cubic-bezier(0.23, 1, 0.32, 1)`. Mục lục active trượt nhẹ; modal tải file và popover xuất hiện từ `opacity: 0`, `scale: .97`; bấm nút scale `.97`. Không animate khi người dùng bật `prefers-reduced-motion`.

### Typography System

**DM Serif Display** tạo cá tính cho tiêu đề lớn và phần mở đầu; **DM Sans** dùng cho body, navigation, bảng và controls để dễ đọc tiếng Việt. Tiêu đề body dùng DM Sans weight 700; code dùng **JetBrains Mono**. Khoảng cách dòng nội dung chính rộng 1.8 để học lâu.

### Brand Essence

**PRJ301 Study Hub là bàn đọc Java Web có cấu trúc cho sinh viên muốn chuyển slide thành hiểu biết có thể áp dụng.** Tính cách: bình tĩnh, có hệ thống, khích lệ.

### Brand Voice

Giọng điệu thẳng, gần gũi và giúp người học định vị bản thân trong bài. Headline dùng động từ rõ nghĩa; microcopy tránh sáo rỗng.

> “Đọc luồng request. Hiểu đường đi của dữ liệu.”

> “Chọn một session, học đến khi ý chính trở nên rõ ràng.”

### Wordmark & Logo

Biểu tượng là một **trang giấy gấp góc** chứa ba vạch tín hiệu như luồng HTTP, kết thúc bằng mũi tên nhỏ; nét teal đậm trên nền trong suốt. Wordmark đi kèm dùng DM Sans đậm, với ký hiệu `/` ở trước “PRJ301”.

## Style Decisions

- Không dùng gradient tím, UI neon, hay bố cục hero căn giữa đại trà.
- Nội dung bài học phải luôn có tương phản cao và chiều rộng đọc khoảng 70–78 ký tự.
- Các khối Markdown như bảng, quote, code và checklist được style như các thành phần biên tập độc lập.
- Lockup biểu tượng trang giấy gấp + `/PRJ301` là nhận diện chính; motif request–response được lặp lại ở mục lục và đầu session.
- Mỗi session dùng DM Serif Display cho cảm giác được biên tập; các điểm đọc, thực hành, takeaway và code/reference có nhãn riêng.
- Nhịp trang ưu tiên các dấu hiệu notebook—rule line, tab, vùng ghi chú và biểu tượng gấp góc—thay vì các card dashboard đồng dạng.
