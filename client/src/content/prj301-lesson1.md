# PRJ301 — Bài 1: Ứng dụng web cơ bản và servlet
## Java Web cơ bản, Servlet, HTML Form, GET/POST và xử lý dữ liệu

> **Mục tiêu của tài liệu:** Tài liệu này được biên soạn từ bốn video Bài 1 của cô Trịnh Thị Vân Anh, kết hợp với tài liệu API chính thức. Mình viết lại theo cách học từng bước: hiểu browser gửi gì, Tomcat gọi Servlet nào, `doGet()`/`doPost()` chạy khi nào, dữ liệu sau dấu `?` là gì và cách làm form thực hành.

## 1. Bốn video đang dạy gì?

| Video | Chủ đề theo tiêu đề công khai | Ý chính bạn nên học |
|---|---|---|
| Phần 2 | Giới thiệu ứng dụng web và viết chương trình đầu tiên | Mô hình web, Servlet đầu tiên, query string, `doGet`, điều hướng. [1] |
| Phần 3 | Tính diện tích hình chữ nhật và Login | HTML form, so sánh GET/POST, `getParameter`, tính toán, login đơn giản, `context-param`. [2] |
| Phần 4 | Tạo Servlet thủ công: checkbox, radio, select | Tạo `HttpServlet` thủ công, annotation/web.xml, `getParameterValues`, kiểm tra `null`. [3] |
| Phần 5 | Ví dụ form thông tin sinh viên | Form tổng hợp, parse điểm, xử lý tiếng Việt UTF-8, phản hồi HTML. [4] |

Mạch học của bốn video rất hợp lý: trước hết hiểu **request–response**, sau đó tạo Servlet, cho browser gửi dữ liệu vào Servlet bằng form, rồi xử lý các kiểu input thường gặp. Điều quan trọng là đừng học rời từng câu lệnh. Mỗi dòng code chỉ có ý nghĩa khi bạn thấy được luồng từ browser đến Tomcat rồi quay lại browser.

---

# Phần A — Bức tranh lớn của Java Web

## 2. Từ URL trên browser đến Java code

Khi em gõ một URL hoặc bấm nút Submit, browser không gọi trực tiếp một method Java. Nó gửi một **HTTP request**. Tomcat nhận request, xem đường dẫn URL, tìm Servlet có mapping phù hợp, sau đó gọi `service()`. Với `HttpServlet`, `service()` tự phân phối request đến `doGet()`, `doPost()` hoặc method `doXXX()` tương ứng. [5]

```text
Browser
  │
  │ HTTP request: method + URL + headers + body
  ▼
Tomcat / Servlet Container
  │  tìm URL mapping
  ▼
Servlet (controller)
  │  đọc parameter, xử lý logic
  ▼
HTTP response: status + headers + body
  │
  ▼
Browser render HTML
```

Hãy lấy ví dụ URL sau:

```text
http://localhost:8080/SE1627-Bai1/test?name=An&score=8.5
```

| Thành phần | Giá trị | Nghĩa là gì? |
|---|---|---|
| Protocol | `http` | Quy tắc browser và server trao đổi dữ liệu |
| Host | `localhost` | Máy đang chạy Tomcat của em |
| Port | `8080` | Cổng Tomcat thường dùng trong môi trường học |
| Context path | `/SE1627-Bai1` | Tên ứng dụng đã deploy |
| URL pattern | `/test` | Đường dẫn mapping đến Servlet |
| Query string | `?name=An&score=8.5` | Dữ liệu đi sau dấu `?` trên thanh địa chỉ |

> **Cách nhớ ngắn:** Context path chỉ **ứng dụng nào**, URL pattern chỉ **Servlet nào**, query string chứa **dữ liệu gửi kèm**.

---

# Phần B — Chỗ em nghe là “đi qua dấu `?`”: Query String và GET

## 3. Query string là gì?

Query string là phần nằm **sau dấu `?` trong URL**. Nó gồm các cặp `tên=giá_trị`, các cặp cách nhau bằng dấu `&`.

```text
/test?length=5&width=3
      └───── query string ─────┘
```

Khi request đến Servlet, em đọc dữ liệu bằng:

```java
String lengthRaw = request.getParameter("length");
String widthRaw = request.getParameter("width");
```

`getParameter("length")` không quan tâm dữ liệu đến từ query string hay từ form POST theo cách thông thường. Servlet API nói rõ request parameter HTTP có thể nằm trong **query string** hoặc **posted form data**; `getParameter()` trả về `String` hoặc `null` khi không có parameter đó. [6]

### Ví dụ 1: Gọi Servlet bằng URL trực tiếp

Nếu Servlet mapping là `/area`, em có thể gõ:

```text
http://localhost:8080/SE1627-Bai1/area?length=8&width=2.5
```

Trong Servlet:

```java
String lengthRaw = request.getParameter("length"); // "8"
String widthRaw = request.getParameter("width");   // "2.5"
```

Lưu ý rất quan trọng: **mọi dữ liệu từ `getParameter()` ban đầu đều là `String`**. Nếu cần tính toán, phải chuyển kiểu:

```java
double length = Double.parseDouble(lengthRaw);
double width = Double.parseDouble(widthRaw);
double area = length * width;
```

Nếu người dùng không nhập, nhập `abc`, hoặc parameter bị thiếu thì parse có thể ném `NumberFormatException`. Đây là lỗi video Phần 4 và Phần 5 đã nhắc qua khi xử lý input số. [3] [4]

---

## 4. GET và `doGet()` — khi nào dùng?

**GET** thường dùng khi client muốn lấy/hiển thị một resource hoặc thực hiện thao tác không nên thay đổi trạng thái nghiệp vụ. Trong `HttpServlet`, request GET được container dispatch đến `doGet()`. [5]

Các tình huống dễ gặp:

| Cách người dùng thao tác | Browser thường gửi | Servlet nhận ở |
|---|---|---|
| Gõ URL trên thanh địa chỉ | GET | `doGet()` |
| Bấm một thẻ `<a href="...">` | GET | `doGet()` |
| Form có `method="get"` | GET | `doGet()` |
| Mở lại một URL đã bookmark | GET | `doGet()` |

Ví dụ form GET tính diện tích:

```html
<form action="area" method="get">
    <label>Chiều dài</label>
    <input type="number" name="length" step="any" required>

    <label>Chiều rộng</label>
    <input type="number" name="width" step="any" required>

    <button type="submit">Tính diện tích</button>
</form>
```

Sau khi bấm submit, browser có thể biến dữ liệu thành URL kiểu:

```text
/area?length=5&width=4
```

Nên dữ liệu sẽ hiện trên thanh địa chỉ. Điều này tiện cho các trang **tìm kiếm**, **lọc danh sách**, hoặc thao tác mà em muốn copy URL gửi cho người khác. Ví dụ:

```text
/products?keyword=laptop&sort=price
```

### `doGet()` ví dụ tính diện tích

Ví dụ dưới đây dùng namespace `javax.servlet` phù hợp **Tomcat 9 + Java EE 8** như thông tin môn học ban đầu của em.

```java
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/area")
public class AreaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        String lengthRaw = request.getParameter("length");
        String widthRaw = request.getParameter("width");

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html><head><meta charset='UTF-8'></head><body>");

        if (lengthRaw == null || widthRaw == null) {
            out.println("<h2>Hãy truyền length và width trên URL hoặc từ form.</h2>");
        } else {
            try {
                double length = Double.parseDouble(lengthRaw);
                double width = Double.parseDouble(widthRaw);
                out.println("<h2>Diện tích = " + (length * width) + "</h2>");
            } catch (NumberFormatException ex) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("<h2>Dữ liệu phải là số hợp lệ.</h2>");
            }
        }

        out.println("</body></html>");
    }
}
```

### Điểm dễ nhầm về GET

GET **không có nghĩa** là “dữ liệu không an toàn vì hiện sau `?`” theo nghĩa bảo mật duy nhất. Vấn đề chính là query string dễ xuất hiện trong address bar, history, bookmark, log và có thể bị gửi đi theo cách không phù hợp; vì thế không nên truyền password, token hoặc thông tin nhạy cảm bằng query string. Muốn bảo vệ dữ liệu trên đường truyền vẫn cần **HTTPS**; chuyển từ GET sang POST không tự mã hóa dữ liệu. HTTP Semantics định nghĩa GET là safe method và POST là method gửi dữ liệu cho xử lý theo ngữ nghĩa server. [7]

---

# Phần C — POST và `doPost()`

## 5. POST khác GET thế nào?

Trong form HTML, `method="post"` khiến browser gửi dữ liệu trong **request body** thay vì gắn vào query string trên URL. `HttpServlet` nhận POST qua `doPost()`. [5]

| Tiêu chí | GET / `doGet()` | POST / `doPost()` |
|---|---|---|
| Dữ liệu form thường nằm ở đâu? | Query string sau `?` | Request body |
| Có hiện ngay trên thanh URL? | Thường có | Không theo dạng query string của form |
| Phù hợp | Tìm kiếm, lọc, xem chi tiết, URL muốn bookmark | Đăng nhập, tạo/sửa/xóa dữ liệu, submit form có thay đổi nghiệp vụ |
| Có thể bookmark/share URL với dữ liệu? | Có, thường thuận tiện | Không theo cách thông thường |
| Method Servlet tương ứng | `doGet()` | `doPost()` |
| Có tự mã hóa dữ liệu không? | Không | Cũng không; cần HTTPS để mã hóa khi truyền |

Ví dụ form login:

```html
<form action="login" method="post">
    <label>Username</label>
    <input type="text" name="username" required>

    <label>Password</label>
    <input type="password" name="password" required>

    <button type="submit">Login</button>
</form>
```

Khi bấm Login, browser gửi POST đến `/login`. Tomcat tìm mapping `/login`, sau đó gọi `LoginServlet.doPost()`. Nếu em chỉ viết `doGet()` nhưng form dùng POST, servlet không xử lý theo ý em; tình huống điển hình là HTTP **405 Method Not Allowed**. Điều này xảy ra vì `service()` phân phối request dựa theo HTTP method. [5]

---

## 6. `doPost()` ví dụ Login cơ bản

Ví dụ này chỉ để học luồng form → Servlet. Nó **không phải login production** vì password còn hard-code. Khi học JDBC/JPA, phần so sánh này phải chuyển sang lớp DAO/Service và password phải được hash đúng cách.

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

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if (username == null || password == null
                || username.trim().isEmpty() || password.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Bạn phải nhập username và password.");
            return;
        }

        boolean valid = "admin".equals(username) && "123".equals(password);

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>");

        if (valid) {
            out.println("<h2>Hello, " + escapeHtml(username) + "!</h2>");
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("<h2>Sai thông tin đăng nhập. Hãy nhập lại.</h2>");
        }

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

`request.setCharacterEncoding("UTF-8")` đặt trước khi đọc parameter body là thói quen tốt cho form POST chứa tiếng Việt. `response.setContentType("text/html;charset=UTF-8")` giúp browser biết response là HTML UTF-8; video Phần 5 cũng dùng cấu hình này cùng `<meta charset="UTF-8">`. [4]

---

# Phần D — Form gửi dữ liệu như thế nào?

## 7. Bốn attribute em phải nhìn đầu tiên

Khi một form không chạy, hãy mở HTML và kiểm tra bốn thứ này trước khi nghĩ tới Java:

| Thành phần | Ví dụ | Vai trò |
|---|---|---|
| `action` | `action="student"` | Endpoint được gửi đến |
| `method` | `method="post"` | Browser gửi GET hay POST |
| `name` | `name="fullName"` | Khóa dùng cho `getParameter("fullName")` |
| `value` | `value="female"` | Giá trị thực sự gửi đi của radio/option/checkbox |

### Quy tắc vàng: `name` phải khớp

```html
<input type="text" name="fullName">
```

thì Java phải là:

```java
String fullName = request.getParameter("fullName");
```

Nếu HTML ghi `name="fullname"` mà Java đọc `"fullName"`, Java trả về `null`. Đây là lỗi phổ biến nhất khi mới học Servlet.

## 8. Text input, radio và select

### Text input

```html
<input type="text" name="name">
```

```java
String name = request.getParameter("name");
```

### Radio button: dùng **cùng name**, lấy một giá trị

```html
<label><input type="radio" name="gender" value="male" checked> Nam</label>
<label><input type="radio" name="gender" value="female"> Nữ</label>
```

```java
String gender = request.getParameter("gender");
```

Vì radio trong cùng một nhóm chỉ có thể chọn một phương án, `getParameter()` là phù hợp. Nếu người dùng không chọn và form không có default/`required`, `gender` có thể là `null`.

### Select: lấy `value` của option được chọn

```html
<select name="course">
    <option value="PRJ301">PRJ301</option>
    <option value="JPD101">JPD101</option>
    <option value="PRN211">PRN211</option>
</select>
```

```java
String course = request.getParameter("course"); // Ví dụ: "PRJ301"
```

### Checkbox: hai cách đặt name

**Cách A — mỗi checkbox có name riêng.** Cách này dễ hiểu khi mới học, nhưng dài nếu có nhiều lựa chọn.

```html
<label><input type="checkbox" name="java" value="Java"> Java</label>
<label><input type="checkbox" name="sql" value="SQL"> SQL</label>
```

```java
boolean likesJava = request.getParameter("java") != null;
boolean likesSql = request.getParameter("sql") != null;
```

**Cách B — checkbox chung name.** Đây là cách linh hoạt hơn, dùng `getParameterValues()` để lấy mảng tất cả giá trị đã chọn.

```html
<label><input type="checkbox" name="skills" value="Java"> Java</label>
<label><input type="checkbox" name="skills" value="SQL"> SQL</label>
<label><input type="checkbox" name="skills" value="HTML"> HTML</label>
```

```java
String[] skills = request.getParameterValues("skills");

if (skills == null) {
    // Người dùng chưa chọn checkbox nào
} else {
    for (String skill : skills) {
        // Java, SQL, HTML...
    }
}
```

`getParameterValues()` trả về `String[]`, hoặc `null` nếu parameter không tồn tại; đó chính là lý do phải kiểm tra `null` trước khi for-loop. [6]

---

# Phần E — `forward` và `sendRedirect`: đều “chuyển trang” nhưng khác nhau

## 9. `RequestDispatcher.forward()`

`forward` là chuyển tiếp **nội bộ trong server**. Browser vẫn đang giữ một request cũ; server đưa request đó sang tài nguyên khác xử lý. URL trên thanh địa chỉ thường **không đổi**.

```java
request.getRequestDispatcher("index.html").forward(request, response);
```

Trong video, `doGet()` được dùng để forward người dùng về form `index.html`; sau đó `doPost()` xử lý submit. [3] [4]

Một ví dụ hướng MVC hơn sau này là:

```java
request.setAttribute("message", "Đăng nhập thành công");
request.getRequestDispatcher("result.jsp").forward(request, response);
```

Khi forward tới JSP, JSP có thể đọc request attribute và hiển thị dữ liệu. Nếu forward tới `index.html` tĩnh, file HTML không tự đọc được `request.setAttribute`; đó là lý do sau này môn học dùng JSP.

## 10. `response.sendRedirect()`

Redirect nói với browser: “hãy tạo một request mới tới URL khác”. Browser sẽ gửi request mới, nên URL **thay đổi**. Video Phần 2 có minh họa cả `sendRedirect` và `RequestDispatcher.forward`. [1]

```java
response.sendRedirect("index.html");
```

| Tiêu chí | `forward()` | `sendRedirect()` |
|---|---|---|
| Số HTTP request browser tạo | Một | Thường là hai: request cũ + request mới |
| URL browser | Thường giữ nguyên | Đổi sang URL mới |
| Dùng lại request attribute? | Có | Không, vì request mới |
| Hay dùng khi | Chuyển đến view/JSP trong cùng flow | Sau POST thành công, chuyển URL rõ ràng, đi sang endpoint khác |

> **Mẹo nhớ:** `forward` là server “chuyền nội bộ”; `redirect` là browser “đi lại từ đầu”.

---

# Phần F — Bài thực hành tổng hợp: Form thông tin sinh viên

## 11. Yêu cầu bài thực hành

Em hãy tạo một project `StudentServletDemo`. Trang đầu có form nhập họ tên, điểm, giới tính và môn học. Khi bấm Submit, form gửi POST đến Servlet. Servlet đọc dữ liệu, kiểm tra điểm, chào theo giới tính và trả về HTML UTF-8. Bài này tổng hợp trực tiếp nội dung video Phần 4 và Phần 5. [3] [4]

### Bước 1: Tạo project và kiểm tra context path

Trong NetBeans, tạo **Java Web → Web Application**, chọn server đúng với môi trường của em. Nếu project tên `StudentServletDemo`, URL có thể là:

```text
http://localhost:8080/StudentServletDemo/
```

Đừng nhầm context path với URL pattern. Nếu Servlet có mapping `/student`, URL đầy đủ là:

```text
http://localhost:8080/StudentServletDemo/student
```

### Bước 2: `index.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thông tin sinh viên</title>
</head>
<body>
    <h1>Form thông tin sinh viên</h1>

    <form action="student" method="post">
        <p>
            <label>Họ tên:</label>
            <input type="text" name="fullName" required>
        </p>

        <p>
            <label>Điểm:</label>
            <input type="number" name="score" step="0.1" min="0" max="10" required>
        </p>

        <p>
            Giới tính:
            <label><input type="radio" name="gender" value="male" checked> Nam</label>
            <label><input type="radio" name="gender" value="female"> Nữ</label>
        </p>

        <p>
            <label>Môn học:</label>
            <select name="course">
                <option value="PRJ301">PRJ301</option>
                <option value="JPD101">JPD101</option>
                <option value="PRN211">PRN211</option>
            </select>
        </p>

        <p>
            Kỹ năng:
            <label><input type="checkbox" name="skills" value="Java"> Java</label>
            <label><input type="checkbox" name="skills" value="SQL"> SQL</label>
            <label><input type="checkbox" name="skills" value="HTML"> HTML</label>
        </p>

        <button type="submit">Gửi thông tin</button>
    </form>
</body>
</html>
```

### Bước 3: `StudentServlet.java`

```java
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/student")
public class StudentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        RequestDispatcher dispatcher = request.getRequestDispatcher("index.html");
        dispatcher.forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String fullName = request.getParameter("fullName");
        String gender = request.getParameter("gender");
        String course = request.getParameter("course");
        String[] skills = request.getParameterValues("skills");
        String scoreRaw = request.getParameter("score");

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html lang='vi'><head><meta charset='UTF-8'></head><body>");

        try {
            double score = Double.parseDouble(scoreRaw);
            String title = "male".equals(gender) ? "Mr" : "Ms";

            out.println("<h2>Xin chào " + title + " " + escapeHtml(fullName) + "</h2>");
            out.println("<p>Môn học: " + escapeHtml(course) + "</p>");
            out.println("<p>Điểm: " + score + "</p>");
            out.println("<p>Kết quả: " + (score >= 5 ? "Chúc mừng, bạn đã qua môn." : "Bạn cần ôn tập thêm.") + "</p>");

            out.println("<p>Kỹ năng: ");
            if (skills == null) {
                out.println("Chưa chọn kỹ năng nào");
            } else {
                for (String skill : skills) {
                    out.println(escapeHtml(skill) + " ");
                }
            }
            out.println("</p>");
        } catch (NumberFormatException ex) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("<h2>Điểm phải là một số hợp lệ.</h2>");
        }

        out.println("<p><a href='index.html'>Quay lại form</a></p>");
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

### Bước 4: Dòng chạy thực tế

```text
1. Browser mở /StudentServletDemo/student bằng GET.
2. Tomcat gọi StudentServlet.doGet().
3. doGet() forward đến index.html để browser nhận form.
4. Người dùng nhập dữ liệu, bấm Submit.
5. Browser gửi POST /StudentServletDemo/student.
6. Tomcat gọi StudentServlet.doPost().
7. doPost() đọc parameters, parse điểm, xử lý logic.
8. Servlet ghi HTML vào response.
9. Browser hiển thị kết quả.
```

---

# Phần G — Tạo Servlet bằng annotation hay `web.xml`?

## 12. Cách 1: Annotation `@WebServlet`

```java
@WebServlet("/student")
public class StudentServlet extends HttpServlet {
    // doGet, doPost
}
```

Đây là cách gọn và được dùng nhiều khi bắt đầu học. `/student` là URL pattern.

## 13. Cách 2: `web.xml`

Nếu không dùng annotation, có thể khai báo trong `WEB-INF/web.xml`:

```xml
<servlet>
    <servlet-name>StudentServlet</servlet-name>
    <servlet-class>controller.StudentServlet</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>StudentServlet</servlet-name>
    <url-pattern>/student</url-pattern>
</servlet-mapping>
```

| Thành phần | Ý nghĩa |
|---|---|
| `servlet-class` | Tên class Java đầy đủ package |
| `servlet-name` | Tên logic để liên kết declaration và mapping |
| `url-pattern` | Đường dẫn browser gọi |

Không cần khai báo hai cách cho cùng một mapping khi đang học cơ bản. Chọn một cách để code dễ đọc; video Phần 4 minh họa cả annotation lẫn `web.xml`. [3]

---

# Phần H — `context-param` trong `web.xml`

## 14. Lưu cấu hình dùng chung cho ứng dụng

Video Login nói đến `context-param`, tức tham số dùng chung trong phạm vi toàn web application. Ví dụ chỉ để học cách cấu hình:

```xml
<context-param>
    <param-name>demoUsername</param-name>
    <param-value>admin</param-value>
</context-param>

<context-param>
    <param-name>demoPassword</param-name>
    <param-value>123</param-value>
</context-param>
```

Trong Servlet:

```java
String expectedUsername = getServletContext().getInitParameter("demoUsername");
String expectedPassword = getServletContext().getInitParameter("demoPassword");
```

| Loại cấu hình | Phạm vi | Cách đọc |
|---|---|---|
| `<context-param>` | Toàn web application | `getServletContext().getInitParameter(...)` |
| `<init-param>` nằm trong `<servlet>` | Riêng một Servlet | `getServletConfig().getInitParameter(...)` |

Trong bài tập, không dùng cấu hình này để lưu password thật. Mục đích của ví dụ là hiểu configuration. Trong ứng dụng thật, bí mật cần được quản lý an toàn hơn, và password người dùng phải được hash.

---

# Phần I — Lưu ý Tomcat 9, Tomcat 10 và `javax`/`jakarta`

## 15. Vì sao video có `jakarta` còn slide ban đầu có `javax`?

Video Phần 2 dùng Tomcat 10 và có đoạn thay `javax` thành `jakarta`. Đây không phải lỗi logic: Tomcat 10 chuyển Servlet API từ namespace `javax.*` sang `jakarta.*`. Ngược lại, Tomcat 9/Java EE 8 mà môn học ban đầu của em nêu thường chạy code `javax.servlet.*`. Apache Tomcat có tài liệu migration riêng cho thay đổi namespace này. [8]

| Môi trường | Import Servlet điển hình |
|---|---|
| Tomcat 9 + Java EE 8 | `import javax.servlet.*;` |
| Tomcat 10+ + Jakarta EE | `import jakarta.servlet.*;` |

Ví dụ, nếu project chạy Tomcat 10 nhưng code viết:

```java
import javax.servlet.http.HttpServlet;
```

thì em có thể gặp lỗi thiếu thư viện/không biên dịch. Nếu dự án được thầy yêu cầu chạy Tomcat 9, đừng đổi toàn bộ code sang `jakarta` một cách tự động. Hãy xác nhận server đang dùng trước.

---

# Phần J — Bảng lỗi hay gặp: nhìn triệu chứng, suy ra vị trí cần kiểm tra

| Triệu chứng | Khả năng cao | Kiểm tra theo thứ tự |
|---|---|---|
| `request.getParameter(...)` trả `null` | Sai `name`, field không được gửi, radio/checkbox chưa chọn | So sánh chính tả `name` với chuỗi Java; xem method/action |
| `NumberFormatException` | Chuỗi rỗng hoặc không phải số | Kiểm tra `null`, `trim().isEmpty()`, bọc parse trong `try-catch` |
| `NullPointerException` khi duyệt checkbox | `getParameterValues()` trả `null` | `if (values != null)` trước khi for-loop |
| 404 Not Found | Sai context path, mapping hoặc URL | URL đầy đủ → context path → `@WebServlet`/`web.xml` |
| 405 Method Not Allowed | Form POST nhưng chỉ có `doGet`, hoặc ngược lại | `method` trong form và method Java |
| 500 Internal Server Error | Exception trong code | Xem stack trace Tomcat, không chỉ nhìn trang trắng |
| Tiếng Việt bị lỗi ký tự | Sai encoding request/response/page | `request.setCharacterEncoding("UTF-8")`, `charset=UTF-8`, `<meta charset="UTF-8">` |
| `ClassNotFoundException` | Lệch `javax`/`jakarta` hoặc thiếu library | Xác nhận Tomcat 9 hay 10+ |

> **Debug route nên học thuộc:** URL → context path → URL pattern → HTTP method → parameter name → parse/logic → response status.

---

# Phần K — Câu hỏi tự kiểm tra

## 16. Câu hỏi ngắn

| Câu hỏi | Đáp án kỳ vọng |
|---|---|
| Dữ liệu sau dấu `?` trong URL gọi là gì? | Query string. |
| Form `method="get"` thường gọi method Servlet nào? | `doGet()`. |
| Form `method="post"` thường gọi method Servlet nào? | `doPost()`. |
| Vì sao `getParameter("skills")` không đủ cho checkbox chung name? | Có nhiều giá trị; dùng `getParameterValues("skills")`. |
| `forward()` có đổi URL browser không? | Thường không; đó là chuyển tiếp nội bộ server. |
| `sendRedirect()` có tạo request mới không? | Có; browser nhận redirect rồi gửi request mới. |

## 17. Bài luyện 1 — Sửa lỗi

Form:

```html
<form action="login" method="post">
    <input name="userName">
</form>
```

Servlet:

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) {
    String user = request.getParameter("username");
}
```

Hãy tìm hai lỗi. Đáp án: form gửi **POST** nhưng code đặt ở `doGet`; HTML dùng `name="userName"` nhưng Java đọc `"username"`. Cần viết `doPost()` và gọi `getParameter("userName")`.

## 18. Bài luyện 2 — Dự đoán URL

Với form:

```html
<form action="area" method="get">
    <input name="length" value="7">
    <input name="width" value="4">
</form>
```

Nếu context path là `/demo`, URL sau submit có dạng nào? Đáp án: thường là:

```text
/demo/area?length=7&width=4
```

## 19. Bài luyện 3 — Nâng cấp ví dụ

Từ `StudentServlet`, hãy thêm checkbox `hobbies` có `value="music"`, `"sport"`, `"reading"`. Sau đó hiển thị tất cả sở thích. Yêu cầu bắt buộc: không ném lỗi khi người dùng chưa chọn gì.

---

# Phần L — Key takeaways

- Browser gửi HTTP request; Tomcat dùng URL mapping để gọi Servlet; `HttpServlet.service()` dispatch tới `doGet()` hoặc `doPost()`.
- Phần sau dấu `?` là query string. GET form thường đưa dữ liệu vào URL; POST form gửi dữ liệu trong request body.
- `getParameter()` dùng cho một giá trị; `getParameterValues()` dùng cho nhiều giá trị như checkbox chung `name`.
- Đầu vào từ request luôn nên được kiểm tra `null`, rỗng và định dạng trước khi parse hoặc dùng trong logic.
- `forward()` là luồng nội bộ server, URL thường không đổi; `sendRedirect()` yêu cầu browser tạo request mới, URL đổi.
- Video dùng Tomcat 10/`jakarta`; môi trường slide cũ dùng Tomcat 9/`javax`. Phải chọn import đúng server.
- Khi lỗi, lần theo URL → mapping → method → parameter → parse → response, thay vì sửa ngẫu nhiên.

## References

[1]: https://www.youtube.com/watch?v=F4OC5kTyFaQ "Bài 1: Ứng dụng web cơ bản và servlet — Phần 2"
[2]: https://www.youtube.com/watch?v=pQkt9r1fzc8 "Bài 1: Ứng dụng web cơ bản và servlet — Phần 3: Tính diện tích hình chữ nhật và Login"
[3]: https://www.youtube.com/watch?v=0GE3YLUKugc "Bài 1: Ứng dụng web cơ bản và servlet — Phần 4: Tạo servlet thủ công"
[4]: https://www.youtube.com/watch?v=2ostsT5xbHQ "Bài 1: Ứng dụng web cơ bản và servlet — Phần 5: Ví dụ"
[5]: https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html "Java EE HttpServlet API"
[6]: https://docs.oracle.com/javaee/7/api/javax/servlet/ServletRequest.html "Java EE ServletRequest API"
[7]: https://datatracker.ietf.org/doc/html/rfc9110 "IETF RFC 9110 — HTTP Semantics"
[8]: https://tomcat.apache.org/migration-10.html "Apache Tomcat Migration Guide — Tomcat 10"
