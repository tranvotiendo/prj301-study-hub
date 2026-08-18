# PRJ301 — Java Web Application Development
## Bài giảng Session 1–5: Basic Web Application và Servlet

> **Phạm vi của slide:** Deck bạn gửi gồm 43 slide, đi từ HTML cơ bản, mô hình request–response, HTTP, Servlet, HTML Form, cấu trúc Web Application, `web.xml` đến WAR và triển khai trên Tomcat. Trong bài giảng này, mình chia nội dung thành 5 session liên tục để bạn dễ học. JDBC, JSP, MVC, JPA và AI trong Java Web chưa xuất hiện đầy đủ trong deck này; mình sẽ chỉ liên hệ trước để bạn thấy mạch học về sau.

## 0. Bức tranh lớn trước khi học

Một Java Web Application thường có luồng xử lý như sau:

```text
Browser
   |  HTTP Request: URL, method, headers, body
   v
Tomcat / Servlet Container
   |  tìm URL mapping và gọi Servlet
   v
Servlet / Business logic
   |  có thể đọc request, kiểm tra dữ liệu,
   |  gọi JDBC/JPA để làm việc với database
   v
HTTP Response: status, headers, body
   |
   v
Browser render HTML/CSS/JavaScript
```

Hãy hình dung **browser là khách hàng**, **HTTP request là phiếu yêu cầu**, **Tomcat là lễ tân điều phối**, **Servlet là nhân viên xử lý**, còn **database là kho dữ liệu**. Browser không gọi trực tiếp một phương thức Java. Browser chỉ gửi HTTP; Servlet Container mới chuyển HTTP request đó thành lời gọi Java như `doGet()` hoặc `doPost()`.

| Thành phần | Vai trò dễ hiểu | Ví dụ |
|---|---|---|
| Browser | Gửi request và hiển thị response | Chrome, Edge |
| HTTP | Quy tắc trao đổi request/response | GET, POST, status 200 |
| Tomcat | Servlet Container, quản lý Servlet | Tomcat 9 |
| Servlet | Java class xử lý request | `LoginServlet` |
| HTML/JSP | Nội dung giao diện trả về cho browser | `index.html`, `login.jsp` |
| JDBC/JPA | Cách Java truy cập database | SQL Server, EntityManager |
| WAR | Gói deploy của web application | `MyApp.war` |

Với **Tomcat 9 và Java EE 8**, code Servlet sử dụng package `javax.servlet.*`. Nếu sau này dùng Tomcat 10+, package sẽ chuyển sang `jakarta.servlet.*`; đây là một nguyên nhân phổ biến khiến code cũ không biên dịch khi đổi phiên bản server.

---

# Session 1 — HTML và nền tảng của Web Application

## 1. Mục tiêu học tập

Sau session này, bạn cần giải thích được HTML là gì, phân biệt HTML với ngôn ngữ lập trình, hiểu tag mở/tag đóng, biết browser làm gì với HTML và đọc được một trang HTML tối thiểu. Bạn cũng cần hiểu vì sao Servlet thường trả về nội dung HTML cho browser.

## 2. HTML là gì?

**HTML** là viết tắt của *HyperText Markup Language*. HTML là **markup language**, tức ngôn ngữ đánh dấu, không phải ngôn ngữ lập trình theo nghĩa có thuật toán, vòng lặp và điều kiện như Java.

HTML dùng các **tag** để mô tả cấu trúc và ý nghĩa của nội dung. Ví dụ:

```html
<h1>Danh sách khóa học</h1>
<p>Đây là nội dung giới thiệu.</p>
<a href="https://example.com">Xem chi tiết</a>
```

Browser không hiển thị nguyên văn `<h1>` hay `<p>`. Nó đọc các tag, hiểu rằng `<h1>` là tiêu đề lớn, `<p>` là đoạn văn và `<a>` là liên kết, sau đó render thành giao diện.

Phần lớn tag có cặp mở và đóng:

```html
<p>Đây là một đoạn văn.</p>
```

Trong ví dụ trên, `<p>` là **opening tag**, còn `</p>` là **closing tag**. Một số phần tử có thể viết dạng tự đóng hoặc không cần closing tag theo chuẩn HTML hiện đại, chẳng hạn `<input>` hoặc `<br>`.

## 3. Cấu trúc HTML cơ bản

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Trang đầu tiên</title>
</head>
<body>
    <h1>Xin chào Java Web</h1>
    <p>Trang này được browser render từ HTML.</p>
    <a href="https://www.fpt.edu.vn">FPT University</a>
</body>
</html>
```

Có ba vùng bạn cần nhớ:

| Vùng | Ý nghĩa |
|---|---|
| `<!DOCTYPE html>` | Báo cho browser biết tài liệu dùng HTML5 |
| `<head>` | Metadata, tiêu đề tab, charset, CSS link; thường không phải nội dung chính |
| `<body>` | Nội dung nhìn thấy trên trang |

### Điểm dễ nhầm

`href` phải là URL hợp lệ. Trong slide có ví dụ dùng `http:\\cms.fpt.edu.vn`; cách viết đúng nên là `https://cms.fpt.edu.vn` hoặc `http://cms.fpt.edu.vn`. Dấu gạch chéo trong URL là `/`, không phải `\`.

Tên `name` của input rất quan trọng về sau. Browser gửi dữ liệu theo cặp **tên–giá trị**, ví dụ `user=alice`. Nếu input không có `name`, Servlet thường không đọc được giá trị bằng `getParameter()`.

## 4. Liên hệ với Servlet

Nếu mở một file HTML tĩnh, server chỉ trả lại nội dung file. Nếu cần nội dung thay đổi theo người dùng, Servlet có thể tạo response HTML động:

```java
response.setContentType("text/html;charset=UTF-8");
PrintWriter out = response.getWriter();
out.println("<h1>Xin chào " + username + "</h1>");
```

Cách viết HTML bằng nhiều `out.println()` phù hợp để minh họa Servlet ban đầu, nhưng ứng dụng lớn không nên trộn quá nhiều HTML vào Java. Về sau, ta dùng **JSP để hiển thị** và **MVC để tách giao diện khỏi xử lý**.

## 5. Câu hỏi kiểm tra

1. HTML khác Java ở điểm nào? Vì sao nói HTML là markup language?
2. Trong `<a href="/home">Trang chủ</a>`, đâu là tag, đâu là attribute, đâu là text?
3. Nếu một `<input>` không có thuộc tính `name`, Servlet có thể đọc dữ liệu đó bằng `request.getParameter(...)` không? Vì sao?

## 6. Key takeaways

- HTML mô tả **cấu trúc và nội dung** của web page; nó không thay thế Java để xử lý nghiệp vụ.
- Browser đọc HTML và render thành giao diện; browser không hiển thị các tag theo dạng nguyên bản.
- Tag thường gồm opening tag và closing tag; attribute cung cấp thêm thông tin.
- `name` của form input là cầu nối giữa giao diện HTML và Servlet.
- Servlet có thể trả HTML động, nhưng về sau nên tách xử lý Java và giao diện JSP.

---

# Session 2 — HTTP Request, HTTP Response và status code

## 1. Mục tiêu học tập

Sau session này, bạn cần đọc được cấu trúc một HTTP request và response, phân biệt GET và POST, hiểu method, URL, header, body, status code, `Content-Type`, đồng thời biết ý nghĩa của safe và idempotent.

## 2. HTTP request gồm những gì?

Một request có thể hình dung như sau:

```http
POST /PRJ301/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Accept: text/html

user=alice&pass=secret
```

| Thành phần | Ý nghĩa |
|---|---|
| Method | Client muốn thực hiện loại hành động nào |
| URL/path | Tài nguyên hoặc endpoint được yêu cầu |
| Headers | Metadata về request |
| Blank line | Phân cách header và body |
| Body | Dữ liệu gửi lên, thường có trong POST/PUT |

### GET

GET thường dùng để **lấy dữ liệu** hoặc mở một trang:

```text
GET /PRJ301/products?id=10 HTTP/1.1
```

Dữ liệu query nằm trên URL sau dấu `?`. GET có thể bị lưu trong history, log hoặc bookmark, nên không gửi password bằng GET.

### POST

POST thường dùng để gửi dữ liệu cần xử lý, chẳng hạn login hoặc tạo đơn hàng:

```html
<form action="${pageContext.request.contextPath}/LoginServlet" method="post">
    <input type="text" name="user">
    <input type="password" name="pass">
    <button type="submit">Đăng nhập</button>
</form>
```

POST không có nghĩa là tự động an toàn hay được mã hóa. Muốn bảo vệ dữ liệu trên đường truyền, cần HTTPS; muốn bảo vệ password trong database, cần hash đúng cách. Đây là hai vấn đề khác nhau.

## 3. Safe và idempotent

**Safe** nghĩa là method được thiết kế để không yêu cầu thay đổi trạng thái tài nguyên trên server. **Idempotent** nghĩa là gửi cùng một request nhiều lần có cùng hiệu ứng cuối cùng lên trạng thái server. Theo HTTP Semantics, GET, HEAD, OPTIONS và TRACE là safe; các method safe cùng với PUT và DELETE là idempotent.[4]

| Method | Safe | Idempotent | Ví dụ ý nghĩa |
|---|---:|---:|---|
| GET | Có | Có | Lấy danh sách sản phẩm |
| HEAD | Có | Có | Lấy header, không lấy body |
| OPTIONS | Có | Có | Hỏi server hỗ trợ method nào |
| TRACE | Có | Có | Phục vụ chẩn đoán HTTP |
| PUT | Không | Có | Đặt tài nguyên tại một URL xác định |
| DELETE | Không | Có | Xóa tài nguyên xác định |
| POST | Không | Không đảm bảo | Tạo hoặc thực hiện một xử lý mới |

Ví dụ, `DELETE /users/10` gửi lại nhiều lần vẫn có thể dẫn đến trạng thái “user 10 không tồn tại”, nên được xem là idempotent. Nhưng idempotent **không có nghĩa là response giống hệt từng byte**, cũng không có nghĩa request không có side effect nào.

## 4. HTTP response gồm những gì?

```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<h1>Welcome to Servlets World</h1>
```

Thứ tự logic là:

1. Status line: phiên bản HTTP, status code, reason phrase.
2. Response headers: ví dụ `Content-Type`, `Location`, `Set-Cookie`.
3. Dòng trống.
4. Body: HTML, JSON, text, file hoặc nội dung khác.

Một số status code thường gặp:

| Code | Ý nghĩa | Khi gặp trong bài thực hành |
|---|---|---|
| 200 | Thành công | Servlet xử lý và trả trang bình thường |
| 201 | Đã tạo tài nguyên | Thường gặp khi tạo record qua API |
| 302 | Redirect tạm thời | `response.sendRedirect(...)` |
| 400 | Request không hợp lệ | Thiếu hoặc sai dữ liệu input |
| 401 | Chưa xác thực | Cần đăng nhập |
| 403 | Bị từ chối quyền | Đã biết danh tính nhưng không đủ quyền |
| 404 | Không tìm thấy | Sai URL hoặc sai mapping |
| 405 | Method không được hỗ trợ | Form POST nhưng Servlet chỉ override `doGet()` |
| 500 | Lỗi phía server | Exception trong Java hoặc JSP |
| 503 | Server tạm thời không phục vụ | Server quá tải hoặc đang unavailable |

Slide nhấn mạnh `Content-Type` vì browser cần biết cách diễn giải body. Ví dụ:

```java
response.setContentType("text/html;charset=UTF-8");
```

Nếu trả JSON:

```java
response.setContentType("application/json;charset=UTF-8");
```

## 5. Request headers và demo đọc header

Servlet có thể đọc header bằng `getHeader()`:

```java
String userAgent = request.getHeader("User-Agent");
String host = request.getHeader("Host");
```

Để duyệt tất cả header:

```java
Enumeration<String> names = request.getHeaderNames();
while (names.hasMoreElements()) {
    String name = names.nextElement();
    String value = request.getHeader(name);
    out.println("<p>" + name + " = " + value + "</p>");
}
```

Trong code hiện đại, nên dùng generic `Enumeration<String>` thay vì raw `Enumeration`. Khi xuất dữ liệu header ra HTML thật, cần **escape HTML** để tránh biến dữ liệu đầu vào thành HTML hoặc script độc hại. Demo slide phục vụ học HTTP, chưa phải code production hoàn chỉnh.

## 6. Câu hỏi kiểm tra

1. Vì sao không nên dùng GET để gửi password?
2. Một form gửi POST đến Servlet nhưng Servlet không override `doPost()`. Bạn dự đoán status hoặc lỗi gì?
3. DELETE là idempotent nhưng không safe. Hãy giải thích bằng ví dụ.

## 7. Key takeaways

- HTTP request gồm method, URL, headers và body; response gồm status, headers và body.
- GET thường dùng để đọc; POST thường dùng để gửi dữ liệu cần xử lý.
- `Content-Type` giúp client biết cách đọc response body.
- 404 thường liên quan URL/mapping; 405 thường liên quan method; 500 thường do exception server.
- Safe và idempotent là hai khái niệm khác nhau; POST không được mặc định là idempotent.

---

# Session 3 — Servlet đầu tiên và Servlet Life Cycle

## 1. Mục tiêu học tập

Sau session này, bạn có thể tạo một Servlet kế thừa `HttpServlet`, xử lý GET/POST, lấy `PrintWriter`, đặt content type, giải thích lifecycle `init → service → destroy`, hiểu vai trò của Servlet Container và tránh lỗi về biến dùng chung trong Servlet.

## 2. Servlet là gì?

Servlet là Java class chạy bên trong Web Server/Servlet Container, nhận request từ client và tạo response. Tài liệu API mô tả Servlet có các giai đoạn khởi tạo, phục vụ request và bị loại khỏi service; container gọi `init()` một lần, gọi `service()` để xử lý request, rồi gọi `destroy()` khi dỡ Servlet.[2]

Servlet Container chịu trách nhiệm:

- Nạp class và tạo instance Servlet.
- Gọi `init()`.
- Nhận HTTP request và tạo `HttpServletRequest`, `HttpServletResponse`.
- Gọi `service()`, rồi `service()` phân phối đến `doGet()`, `doPost()` hoặc method phù hợp.
- Quản lý nhiều request đồng thời.
- Gọi `destroy()` khi ứng dụng bị dừng/reload.

## 3. Servlet tối thiểu

Ví dụ tương ứng với slide:

```java
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FirstServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html><body>");
        out.println("<h1>First Servlet</h1>");
        out.println("<p>Servlet đã nhận được GET request.</p>");
        out.println("</body></html>");
    }
}
```

### Giải thích từng phần

`extends HttpServlet` cho biết class này là HTTP Servlet. `doGet()` được container gọi khi client gửi GET. `request` chứa thông tin đi vào; `response` là nơi Servlet thiết lập status, header và body đi ra. `getWriter()` tạo writer để ghi text/HTML.

Nên đặt `Content-Type` **trước khi ghi body**. Nếu response đã commit, việc đổi content type hoặc status có thể không còn tác dụng.

`protected` là mức truy cập thường dùng khi override `HttpServlet`; không cần dùng `public` như ví dụ cũ trên slide. Cả hai có thể khác nhau tùy chữ ký phương thức API, nhưng khi override cần giữ mức truy cập không hẹp hơn phương thức cha.

## 4. Mapping URL bằng annotation

Cách gọn trong Servlet 3.0+ là dùng `@WebServlet`:

```java
package controller;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet("/first")
public class FirstServlet extends HttpServlet {
    // doGet hoặc doPost
}
```

Nếu tên project là `PRJ301Demo`, URL sẽ là:

```text
http://localhost:8080/PRJ301Demo/first
```

Phần `/PRJ301Demo` là **context path** của application; phần `/first` là URL pattern của Servlet.

## 5. Mapping URL bằng `web.xml`

Slide dùng deployment descriptor, vì vậy bạn cần đọc được cấu hình này:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <servlet>
        <servlet-name>FirstServlet</servlet-name>
        <servlet-class>controller.FirstServlet</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>FirstServlet</servlet-name>
        <url-pattern>/first</url-pattern>
    </servlet-mapping>

</web-app>
```

Có ba tên cần phân biệt:

| Thành phần | Ví dụ | Ý nghĩa |
|---|---|---|
| Class name | `controller.FirstServlet` | Tên Java class đầy đủ package |
| Servlet name | `FirstServlet` | Tên logic dùng để liên kết cấu hình |
| URL pattern | `/first` | Đường dẫn client gọi |

Lỗi phổ biến nhất là viết sai `servlet-class`, quên package hoặc mapping khác với URL đang truy cập.

## 6. Servlet lifecycle

```text
Container load class
        |
        v
    init()       gọi một lần
        |
        v
 service()       mỗi request
   /     \
GET       POST
 |         |
doGet()  doPost()
        |
        v
    destroy()    khi unload/reload
```

Ví dụ minh họa lifecycle:

```java
@Override
public void init() throws ServletException {
    System.out.println("Servlet initialized");
}

@Override
protected void doGet(HttpServletRequest request,
                     HttpServletResponse response)
        throws ServletException, IOException {
    System.out.println("Handling GET request");
    response.getWriter().println("Hello");
}

@Override
public void destroy() {
    System.out.println("Servlet destroyed");
}
```

### Điểm rất quan trọng: Servlet có thể xử lý đồng thời

Thông thường container tạo một instance Servlet và dùng instance đó cho nhiều request đồng thời. Vì vậy không nên lưu dữ liệu riêng của request vào instance field:

```java
// Không nên
public class BadServlet extends HttpServlet {
    private String username;

    protected void doGet(...) {
        username = request.getParameter("user");
        // request khác có thể ghi đè username
    }
}
```

Nên dùng biến local trong method:

```java
protected void doGet(HttpServletRequest request,
                     HttpServletResponse response) {
    String username = request.getParameter("user");
}
```

Tài liệu Servlet API cũng cảnh báo rằng Servlet Container có thể xử lý nhiều request đồng thời; lập trình viên phải cẩn thận với tài nguyên và dữ liệu dùng chung.[2]

## 7. Câu hỏi kiểm tra

1. Container gọi `init()` bao nhiêu lần trong vòng đời thông thường của một instance Servlet?
2. `service()` có quan hệ gì với `doGet()` và `doPost()`?
3. Vì sao biến local an toàn hơn instance field khi lưu username của một request?

## 8. Key takeaways

- Servlet là Java class chạy trong Servlet Container, không tự chạy như Java console app.
- `HttpServlet` cung cấp `doGet()`, `doPost()`, `doPut()`, `doDelete()` và các method HTTP khác.
- Lifecycle cơ bản là `init → service → destroy`.
- Có thể mapping bằng `@WebServlet` hoặc `web.xml`; deck tập trung vào `web.xml`.
- Không lưu dữ liệu riêng của request vào instance field vì nhiều request có thể chạy đồng thời.

---

# Session 4 — HTML Form và xử lý dữ liệu trong Servlet

## 1. Mục tiêu học tập

Sau session này, bạn có thể tạo form với text input, password input, radio button và submit button; hiểu `action`, `method`, `name`; đọc dữ liệu bằng `getParameter()`; phân biệt GET/POST trong form; và viết một Servlet xử lý login demo.

## 2. Form HTML

Form là vùng giao diện cho phép người dùng nhập dữ liệu. Ví dụ form đăng nhập:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <h1>Đăng nhập</h1>

    <form action="${pageContext.request.contextPath}/login"
          method="post">
        <label>Username:</label>
        <input type="text" name="user" required>
        <br>

        <label>Password:</label>
        <input type="password" name="pass" required>
        <br>

        <button type="submit">Login</button>
    </form>
</body>
</html>
```

| Attribute | Ý nghĩa |
|---|---|
| `action` | URL nhận dữ liệu sau khi submit |
| `method` | Cách gửi, thường là `get` hoặc `post` |
| `name` | Tên parameter mà Servlet dùng để đọc |
| `value` | Giá trị gửi lên của một số input |
| `required` | Browser kiểm tra không được để trống |

Nếu dùng radio button, các nút cùng nhóm phải có cùng `name`:

```html
<input type="radio" name="gender" value="male"> Nam
<input type="radio" name="gender" value="female"> Nữ
```

Browser chỉ gửi value của radio được chọn. Nếu không chọn gì, parameter có thể là `null`.

## 3. `action` và context path

Slide viết:

```html
<form action="/LoginServlet" method="post">
```

Dấu `/` ở đầu có thể được hiểu là root của host, không nhất thiết là root của project. Nếu project chạy tại `/PRJ301Demo`, URL đúng có thể cần là `/PRJ301Demo/login`.

Trong JSP, cách an toàn hơn là:

```jsp
<form action="${pageContext.request.contextPath}/login" method="post">
```

Hoặc nếu đang viết HTML tĩnh, có thể dùng đường dẫn tương đối phù hợp với vị trí file. Đây là lỗi gây **404 dù Servlet mapping đúng**.

## 4. Đọc form data bằng `getParameter()`

```java
@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String user = request.getParameter("user");
        String pass = request.getParameter("pass");

        if (user == null || pass == null
                || user.trim().isEmpty()
                || pass.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                               "Thiếu username hoặc password");
            return;
        }

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html><body>");
        out.println("<h1>Đã nhận dữ liệu</h1>");
        out.println("<p>Username: " + escapeHtml(user) + "</p>");
        out.println("</body></html>");
    }

    private String escapeHtml(String value) {
        return value.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
    }
}
```

`getParameter("user")` phải trùng chính xác với `name="user"`. Nếu HTML dùng `name="username"` nhưng Java đọc `getParameter("user")`, kết quả là `null`.

### Cảnh báo quan trọng về password

Code trên chỉ để minh họa cách nhận form data. Không được in password ra response, log hoặc lưu plain text trong database. Khi học JDBC/JPA, ta sẽ kiểm tra password bằng cơ chế hash phù hợp và không gửi lại password cho browser.

## 5. `doGet()` và `doPost()` phải khớp với form

Form:

```html
<form action="login" method="post">
```

thì Servlet phải có:

```java
@Override
protected void doPost(...) { ... }
```

Nếu form bỏ `method`, mặc định HTML thường là GET, khi đó `doGet()` mới được gọi. Nếu chỉ viết `doPost()` mà truy cập URL trực tiếp trên browser, browser gửi GET và có thể nhận 405 hoặc behavior không như mong đợi.

## 6. Luồng chạy hoàn chỉnh

```text
1. User mở login.jsp
2. Browser render form
3. User nhập user/pass
4. Click Login
5. Browser tạo POST /PRJ301Demo/login
6. Tomcat tìm mapping /login
7. Tomcat gọi LoginServlet.doPost()
8. Servlet đọc getParameter("user"), getParameter("pass")
9. Servlet kiểm tra dữ liệu hoặc gọi database
10. Servlet trả response hoặc redirect sang trang khác
```

Trong kiến trúc MVC sau này, bước 9 sẽ thường gọi Service/DAO, còn bước 10 sẽ chuyển dữ liệu sang JSP thay vì tự nối HTML trong Servlet.

## 7. Câu hỏi kiểm tra

1. `name` trong `<input name="user">` liên quan thế nào đến `getParameter("user")`?
2. Vì sao form login nên dùng POST thay vì GET, dù POST không tự mã hóa dữ liệu?
3. Nếu `getParameter()` trả về `null`, hãy nêu ít nhất ba nguyên nhân có thể xảy ra.

## 8. Key takeaways

- `action` xác định endpoint nhận form; `method` xác định GET hay POST.
- `name` là tên parameter; Java phải đọc đúng tên này.
- Form POST phải được xử lý bởi `doPost()`.
- Luôn kiểm tra `null`, chuỗi rỗng và encoding.
- Không in hoặc lưu password plain text; code demo nhận dữ liệu không phải logic xác thực production.

---

# Session 5 — Web Application structure, `web.xml`, welcome file và WAR

## 1. Mục tiêu học tập

Sau session này, bạn có thể mô tả cấu trúc thư mục của một Java Web Application, hiểu vai trò đặc biệt của `WEB-INF`, đọc `web.xml`, cấu hình welcome file, phân biệt thư mục exploded với WAR và deploy application lên Tomcat.

## 2. Cấu trúc web application

Một cấu trúc tối thiểu có thể là:

```text
PRJ301Demo/
├── index.html
├── login.jsp
├── css/
│   └── style.css
├── images/
├── WEB-INF/
│   ├── web.xml
│   ├── classes/
│   │   └── controller/
│   │       └── LoginServlet.class
│   └── lib/
│       └── some-library.jar
└── META-INF/
```

| Vị trí | Có thể truy cập trực tiếp bằng browser? | Vai trò |
|---|---:|---|
| Context root | Có | Tài nguyên public như HTML, CSS, ảnh, JSP tùy cấu hình |
| `WEB-INF/` | Không trực tiếp | Vùng bảo vệ của web application |
| `WEB-INF/classes/` | Không trực tiếp | Java class đã compile |
| `WEB-INF/lib/` | Không trực tiếp | JAR dependencies |
| `WEB-INF/web.xml` | Không trực tiếp | Deployment descriptor |
| `META-INF/` | Không theo URL public thông thường | Metadata/context-related files |

Điểm rất quan trọng: browser không nên truy cập trực tiếp `.class`, `web.xml` hoặc JAR trong `WEB-INF`. Container dùng chúng để chạy application.

## 3. Deployment descriptor `web.xml`

`web.xml` là file XML cấu hình web application. Một cấu hình đơn giản:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <display-name>PRJ301Demo</display-name>

    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>

    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>controller.LoginServlet</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>

</web-app>
```

### Cách đọc mapping

Khi browser gọi:

```text
http://localhost:8080/PRJ301Demo/login
```

Tomcat đọc path `/login`, tìm `<url-pattern>/login</url-pattern>`, lấy `servlet-name` là `LoginServlet`, rồi tìm class `controller.LoginServlet` để tạo hoặc sử dụng instance Servlet.

`<servlet-name>` không nhất thiết phải giống class name, nhưng nên đặt tên rõ ràng để giảm nhầm lẫn.

## 4. Welcome file

Khi người dùng mở:

```text
http://localhost:8080/PRJ301Demo/
```

Tomcat cần biết tài liệu mặc định nào sẽ được tìm trước. Cấu hình:

```xml
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.jsp</welcome-file>
</welcome-file-list>
```

Nếu không có file phù hợp và không có mapping phù hợp, có thể nhận 404 hoặc directory listing bị tắt. Không nên phụ thuộc vào việc server tự hiển thị danh sách thư mục trong production.

## 5. Tạo project bằng NetBeans 13 và Tomcat 9

### Bước 1: Chuẩn bị server

Cài JDK tương thích với NetBeans 13, tải Tomcat 9, giải nén vào thư mục không có ký tự đặc biệt, ví dụ:

```text
C:\Servers\apache-tomcat-9.x.x
```

Trong NetBeans, mở **Services → Servers → Add Server → Apache Tomcat**, chọn thư mục Tomcat và cấu hình username/password nếu NetBeans yêu cầu.

### Bước 2: Tạo Web Application

Chọn **File → New Project → Java Web → Web Application**. Đặt tên project là `PRJ301Demo`, chọn Tomcat 9 và Java EE 8 nếu giao diện hiển thị lựa chọn này. Tạo project.

NetBeans thường tạo sẵn `index.html` hoặc `index.jsp`, thư mục `WEB-INF` và cấu hình project. Không nên xóa file cấu hình khi chưa hiểu vai trò của chúng.

### Bước 3: Tạo Servlet

Nhấp phải project → **New → Servlet**. Đặt class là `FirstServlet`, package là `controller`, URL pattern là `/first`. NetBeans có thể sinh `@WebServlet` tự động.

Đặt code:

```java
@WebServlet("/first")
public class FirstServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().println("<h1>Hello from PRJ301</h1>");
    }
}
```

### Bước 4: Chạy và kiểm tra

Nhấp phải project → **Run**. Truy cập:

```text
http://localhost:8080/PRJ301Demo/first
```

Nếu project có context path khác, hãy nhìn URL NetBeans mở hoặc xem Project Properties. Không tự đoán context path chỉ từ tên file Java.

### Bước 5: Nếu dùng `web.xml`

Nếu không dùng annotation, tạo mapping trong `WEB-INF/web.xml`. Không cấu hình vừa annotation vừa web.xml với cùng một mapping một cách tùy tiện, vì có thể gây khó đọc hoặc xung đột.

## 6. Đóng gói WAR

**WAR** là *Web Application Archive*. Nó có thể dùng cùng dạng archive như JAR/ZIP nhưng mục đích là đóng gói web application để Servlet Container deploy. Tomcat hỗ trợ deploy một exploded directory hoặc một file WAR trong `appBase`, mặc định thường là `$CATALINA_BASE/webapps`.[3]

Có thể tạo WAR bằng NetBeans qua **Clean and Build**. File thường nằm trong thư mục `dist/` hoặc `target/`, tùy loại project và hệ thống build.

Ví dụ:

```text
PRJ301Demo.war
```

Copy vào:

```text
apache-tomcat-9.x.x/webapps/
```

Khi Tomcat deploy, context path thường là tên WAR bỏ đuôi `.war`:

```text
http://localhost:8080/PRJ301Demo/
```

Tomcat có cơ chế auto-deploy trong cấu hình mặc định phổ biến; tài liệu Tomcat mô tả việc WAR được đặt vào appBase và được triển khai khi startup hoặc khi auto-deploy hoạt động.[3]

### WAR không phải JAR

| JAR | WAR |
|---|---|
| Đóng gói thư viện hoặc Java application | Đóng gói web application |
| Thường chứa `.class`, resources | Có context root, HTML/JSP, `WEB-INF`, web.xml, classes, lib |
| Được dùng bởi JVM/app khác | Được deploy bởi Servlet Container |

## 7. Các lỗi deploy thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách kiểm tra |
|---|---|---|
| 404 khi mở URL | Sai context path hoặc URL pattern | Kiểm tra tên WAR, `@WebServlet`, `web.xml` |
| 405 | Gửi GET nhưng chỉ có `doPost`, hoặc ngược lại | Kiểm tra form method và method Java |
| 500 | Exception trong Servlet/JSP | Đọc log Tomcat và stack trace |
| ClassNotFoundException | Sai package/class hoặc thiếu JAR | Kiểm tra `WEB-INF/classes`, `WEB-INF/lib` |
| Port 8080 đang dùng | Server khác chiếm port | Đổi port hoặc dừng process cũ |
| Sửa code nhưng không thấy thay đổi | App chưa redeploy/reload | Clean and Build, restart/redeploy |
| File trong `WEB-INF` mở được trực tiếp | Cấu hình server bất thường hoặc nhầm URL | Không đặt tài nguyên public cần truy cập vào `WEB-INF` |

Khi debug, hãy đi từ ngoài vào trong: **URL → context path → mapping → class → method → parameter → business logic → response**. Không nên sửa ngẫu nhiên nhiều file cùng lúc.

## 8. Câu hỏi kiểm tra

1. Vì sao `WEB-INF/web.xml` không nên được mở trực tiếp từ browser?
2. Nếu file tên `PRJ301Demo.war` được deploy vào `webapps`, context path thường là gì?
3. Hãy phân biệt `servlet-class`, `servlet-name` và `url-pattern`.

## 9. Key takeaways

- Web application có quy tắc cấu trúc; `WEB-INF` là vùng đặc biệt do container quản lý.
- `web.xml` định nghĩa metadata và mapping nếu không hoặc chưa dùng annotation.
- Welcome file giúp xác định trang mặc định khi mở context root.
- WAR là gói deploy cho web container, không phải JAR thư viện thông thường.
- Khi gặp lỗi, phân loại theo URL, mapping, method, exception và deployment.

---

# Bài thực hành tổng hợp: Login Servlet không dùng database

Bài này gom toàn bộ kiến thức của 5 session. Mục tiêu chỉ là hiểu request–response và mapping; chưa phải login thật vì chưa có JDBC/database.

## 1. Cấu trúc mong muốn

```text
PRJ301Demo/
├── login.html hoặc login.jsp
└── WEB-INF/
    └── web.xml
```

## 2. Giao diện login

Nếu dùng JSP, đặt file `login.jsp` ở web root:

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>PRJ301 Login Demo</title>
</head>
<body>
    <h1>Login Demo</h1>
    <form action="${pageContext.request.contextPath}/login" method="post">
        <input type="text" name="user" placeholder="Username" required>
        <input type="password" name="pass" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>
```

## 3. Servlet xử lý

```java
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String user = request.getParameter("user");
        String pass = request.getParameter("pass");

        boolean valid = "admin".equals(user) && "123".equals(pass);

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html lang=\"vi\"><head><meta charset=\"UTF-8\"></head><body>");

        if (valid) {
            out.println("<h1>Đăng nhập thành công</h1>");
            out.println("<p>Xin chào " + escapeHtml(user) + "!</p>");
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("<h1>Đăng nhập thất bại</h1>");
            out.println("<a href=\"" + request.getContextPath() + "/login.jsp\">Thử lại</a>");
        }

        out.println("</body></html>");
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
    }
}
```

Tài khoản demo là `admin / 123`. Đây chỉ là dữ liệu hard-code để kiểm tra flow. Khi học JDBC, ta sẽ thay dòng kiểm tra hard-code bằng DAO truy vấn SQL Server; khi học MVC, ta sẽ chuyển phần HTML sang JSP và tránh để Servlet dựng toàn bộ giao diện.

## 4. Cách kiểm tra từng bước

1. Chạy project và mở `/PRJ301Demo/login.jsp`.
2. Nhập `admin` và `123`, bấm Login.
3. Mở Developer Tools → Network để xem POST URL, status và payload.
4. Thử password sai và quan sát status `401`.
5. Đổi `name="user"` thành `name="username"` nhưng giữ Java là `getParameter("user")`; quan sát kết quả `null` hoặc login thất bại.
6. Đổi form thành `method="get"` trong khi Servlet chỉ có `doPost()`; quan sát lỗi để hiểu sự khác nhau giữa method của form và method Java.
7. Đổi URL pattern `/login` thành `/signin` nhưng không đổi action; quan sát 404 và sửa lại cho khớp.

---

# Bản đồ kiến thức đi tiếp trong môn học

| Kiến thức hiện tại | Kiến thức sẽ nối tiếp | Mối liên hệ |
|---|---|---|
| Servlet nhận request | Scope và Session | Lưu dữ liệu giữa các request |
| Servlet trả HTML | JSP | Tách phần giao diện khỏi Java |
| Servlet xử lý trực tiếp | MVC | Controller điều phối, Model xử lý dữ liệu, View hiển thị |
| JDBC preview | DAO/Service | Kết nối SQL Server và truy vấn an toàn |
| WAR deploy Tomcat | Web project hoàn chỉnh | Đóng gói và triển khai |
| Request parameter | Validation và security | Kiểm tra dữ liệu, chống injection/XSS |
| Java Web truyền thống | JPA | Mapping object–table, giảm SQL lặp lại |
| Servlet/JSP | AI trong Java Web | Gọi dịch vụ AI từ backend, bảo vệ API key, xử lý response |

> **Kết luận của 5 session:** Một web application không bắt đầu từ database hay framework. Nó bắt đầu từ việc hiểu browser gửi HTTP request như thế nào, Tomcat chuyển request đó đến Servlet ra sao, Servlet tạo HTTP response thế nào, và application được tổ chức/đóng gói để server deploy ra sao.

## Tự đánh giá sau khi học xong

Bạn nên tự viết lại, không nhìn tài liệu, câu trả lời cho các câu sau:

1. Mô tả đầy đủ luồng từ lúc nhập URL đến lúc browser hiển thị response.
2. Viết một Servlet có `doGet()` trả về HTML và mapping tại `/hello`.
3. Viết form POST có username/password và Servlet đọc hai parameter.
4. Giải thích vì sao `name` của input phải khớp với chuỗi truyền vào `getParameter()`.
5. Phân biệt context path và URL pattern.
6. Vẽ cấu trúc `WEB-INF/classes`, `WEB-INF/lib`, `WEB-INF/web.xml`.
7. Giải thích 404, 405 và 500 bằng một nguyên nhân cụ thể cho mỗi lỗi.
8. Mô tả lifecycle `init`, `service`, `destroy` và lý do không nên lưu dữ liệu request vào instance field.

## References

[1]: https://docs.oracle.com/javaee/7/tutorial/servlets.htm "Oracle Java EE Tutorial — Java Servlet Technology"
[2]: https://javaee.github.io/javaee-spec/javadocs/javax/servlet/Servlet.html "Java EE 8 Servlet API — Servlet Interface"
[3]: https://tomcat.apache.org/tomcat-9.0-doc/deployer-howto.html "Apache Tomcat 9 — Web Application Deployment"
[4]: https://datatracker.ietf.org/doc/html/rfc9110 "IETF RFC 9110 — HTTP Semantics"
