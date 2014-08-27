websocket_nodejs
================

Study 8/2014

Ngày nay ứng dụng web phát triển với tốc độ chóng mặt, mọi thứ đều trở nên real-time, tự động cập nhật mà không cần phải load lại trang. Đây là một 
trong những chức năng không thể thiếu trong các ứng dụng web hiện đại. Có rất nhiều cách để làm chuyện này – giao tiếp server – client thời gian thực.
Một vài cách phổ biến hiện nay:

- Ajax: Đây là một cách truyền thống, đã có từ rất lâu, chỉ đơn thuần gửi request Ajax liên tục lên Server để lấy dữ liệu về.
Ưu điểm: Dễ thực hiện, đơn giản, hỗ trợ tất cả các trình duyệt thông dụng
Khuyết điểm: Nếu interval cao, thì không thể giống real-time được vì có delay giữa các lần gọi, nếu interval thấp thì client thực hiện request liên tục lên server, rất nhiều request thừa, không có dữ liệu mới cũng phải gửi, ảnh hưởng lớn đến performance của server.

- Ajax with long polling: Vẫn dùng cơ chế như các ở trên, nhưng để cải thiện khuyết điểm người ta thay đổi các thức gọi request lên server như sau: Client tạo request gọi lên server, server không trả response ngay mà giữa request đến khi nào có dữ liệu mới rồi mới trả về cho client, ở client cũng có setTimeout nếu connect chờ lâu quá, sẽ ngắt đi, tạo request mới chờ tiếp.
Ưu điểm: Real-time, hỗ trợ tất cả các trình duyệt thông dụng
Khuyết điểm: Việc giữ request làm tăng tải cho server, đối với các server bình thường, xử lý đồng bộ một thread cho một request, thì nếu có nhiều request sau đó, sẽ gây ra chậm.

- HTML5 Websocket: Websocket là một chức năng mới của HTML5, được thực hiện để tạo kết nối giữa client và server qua một port nào đó. Tất cả dữ liệu giao tiếp giữa client-server sẽ được gửi trực tiếp qua port này thay vì request HTTP bình thường, làm cho thông tin được gửi đi nhanh chóng và liên tục khi cần thiết.
Web socket giả quyết được tất cả khuyết điểm ở các cách phía trên.
Nhưng khuyết điểm lớn nhất websocket là không hỗ trợ các trình duyệt cũ.

Ứng dụng sửa dụng jQuery cho phía client, nodejs cho phía server.
- Phía client-side thực hiện kết nối websocket khá đơn giản.
Tạo kết nối tới server websocket:
.wsocket = new WebSocket("ws://localhost:8080/daemon.php"); 
Sau khi tạo kết nối đến server, chúng ta sẽ set các event phục vụ business của ứng dụng web chat.
WebSocket(wsUri) — tạo đối tượng websocket mới
.onopen — event được gọi khi bắt đầu mở kết nối đến server
.onclose — event được gọi khi ngắt kết nối đến server
.onmessage — event được gọi khi nhận được message gửi từ server về
.onerror — event được gọi khi có lỗi mạng xảy ra.
.send(message) — gửi message đến server
.close() — ngắt kết nối

- Quy trình xử lý của Websocket Server
Mở socket
Ràng buộc vào IP, doamin
Lắng nghe kết nối đến
Chấp nhận kết nối
WebSocket Handshake.
Giải mã/ mã hóa frame gửi nhận
Xử lý thông tin
Ngắt kết nối

- Chạy Websocker Server:
node server.js