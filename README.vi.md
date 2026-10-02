[English](README.md) · **Tiếng Việt**

# Biểu phí hoa hồng TikTok Shop Việt Nam theo ngành hàng, có ngày hiệu lực

Bộ dữ liệu mở của [Ordinex](https://ordinex.cc): biểu phí hoa hồng người bán của
TikTok Shop Việt Nam qua từng lần đổi, đối chiếu theo từng ngành hàng.

Mỗi lần đổi biểu phí, TikTok đăng PDF mới và thay luôn bản cũ. Bản trước không
được lưu công khai, nên sau đó không còn cách biết chính xác ngành của bạn trước
đó chịu mức phí bao nhiêu, đã tăng hay giảm thế nào. Repo này giữ lại phần lịch
sử đó.

## Phí đã thay đổi thế nào

So sánh bản hiệu lực **09/05/2026** với bản hiệu lực **03/07/2026** (shop
thường; shop Mall áp dụng từ **03/08/2026**):

| | Số ngành hàng |
|---|---:|
| Có mặt trong cả hai bản | **1,824** |
| **Tăng** phí | **1,366** |
| **Giảm** phí | **404** |
| Giữ nguyên | **54** |

Ngành tăng nhiều nhất là **Máy đọc sách điện tử**, từ **2% lên 10.5%**, tăng 8.5
điểm phần trăm.

Nói "TikTok Shop tăng phí" không sai, vì phần lớn ngành hàng đúng là tăng. Nhưng
**404 ngành thực tế được giảm**, và phần này gần như không được nhắc tới.

## Lần đổi mới nhất: 20/10/2026

Biểu phí hiệu lực **20/10/2026** chỉ đổi phí của shop Mall: **41 ngành** thuộc
*Sách, tạp chí & âm thanh* xuống **12.5%**, trong đó 40 ngành từ 15% và 1 ngành
từ 16%. Phí shop thường giữ nguyên mức áp dụng từ 03/07/2026. Mọi ngành khác
không đổi.

Toàn bộ biểu phí nằm trong `data/schedule-2026-10-20.json`; file CSV có thêm cột
`mall_pct_latest` là mức Mall mới.

## Trong repo có gì

| Đường dẫn | Là gì |
|---|---|
| `data/tiktok-shop-vn-commission-diff.csv` | Bảng đối chiếu. Mỗi dòng là một ngành, có phí cũ, phí mới cho cả hai loại shop, mức chênh, và mức Mall trong biểu mới nhất. |
| `data/schedule-2026-05-09.json` | Biểu phí hiệu lực 09/05/2026, đã bóc tách. |
| `data/schedule-2026-07-03.json` | Biểu phí hiệu lực 03/07/2026 (shop Mall 03/08/2026), đã bóc tách. |
| `data/schedule-2026-10-20.json` | Biểu phí shop Mall hiệu lực 20/10/2026, đã bóc tách. |
| `method/commission-diff.ts` | Code dùng để đối chiếu và tạo file CSV. |
| `method/commission-matrix.ts` | Định nghĩa kiểu dữ liệu cho các file JSON trên. |
| `CITATION.cff` | Thông tin trích dẫn. |

Cột trong CSV: `group`, `level_1`, `level_2`, `level_3`, `standard_pct_old`,
`standard_pct_new`, `standard_delta`, `mall_pct_old`, `mall_pct_new`,
`mall_delta`, `mall_pct_latest`. Cột cuối là mức Mall trong biểu mới nhất của
repo (hiện là 20/10/2026), bằng `mall_pct_new` trừ 41 ngành nói ở trên.

Tên ngành hàng được giữ **nguyên tiếng Việt, đúng như TikTok công bố**. Đây là
khoá để đối chiếu lại với biểu phí gốc. Nếu dịch sang ngôn ngữ khác, dữ liệu sẽ
mất khả năng kiểm chứng.

## Cách đối chiếu

Mọi biểu phí đều được bóc trực tiếp từ file PDF của TikTok rồi so bằng script.
Không có dòng nào được nhập tay.

Ngành hàng được so khớp theo đủ bốn cấp (`group / level_1 / level_2 / level_3`).
Chỉ những ngành có trong **cả hai** bản mới được tính chênh lệch. Giữa biểu tháng
5 và biểu tháng 7 có **215 ngành mới xuất hiện** và **82 ngành biến mất**, nên
các ngành này không được tính vào con số 1,824.

Code đối chiếu nằm ngay trong repo, tại thư mục [`method/`](method). Đây chính
là những hàm đã tạo ra file CSV, nên bạn có thể tự chạy lại để kiểm tra kết quả.

Nếu tự đối chiếu các biểu phí, có hai chỗ rất dễ dính lỗi:

- Cách viết hoa tên ngành thay đổi giữa các bản. Bản tháng 5 viết `Mẹ & bé`,
  bản tháng 7 viết `Mẹ & Bé`. Nếu so khớp y nguyên từng ký tự, **cả 199 ngành sẽ
  âm thầm bị rụng** khỏi kết quả. Vì vậy, khoá so khớp phải bỏ qua hoa thường và
  gộp khoảng trắng thừa.
- Lớp chữ trong PDF không phải lúc nào cũng là Unicode sạch. "Đồ uống" bị tách
  dấu thanh thành ký tự rời, còn "Pin sạc dự phòng" dùng một chữ Cyrillic thay
  cho chữ "s". Nhìn trên màn hình thì giống hệt, nhưng tìm kiếm và so khớp đều
  hỏng. Tên ngành trong repo đã được chuẩn hoá NFC và kiểm theo bảng chữ tiếng
  Việt. Bản cập nhật tháng 10/2026 sửa 17 tên trong biểu tháng 5 và 15 tên trong
  biểu tháng 7, nhờ vậy 16 ngành khớp lại được giữa hai bản: đó là lý do số ngành
  so được tăng từ 1,808 lên 1,824.

## Giới hạn

Đọc phần này trước khi lấy số liệu đi trích dẫn.

- Đây **chỉ là phí hoa hồng nền tảng**. Chưa tính phí giao dịch (6%, hoặc 5%
  với shop chi đủ GMV Max), phí xử lý đơn, phí Voucher Xtra, phí vận chuyển hay
  các chương trình hỗ trợ.
- Mức phí shop bạn thực trả có thể khác nếu đang tham gia chương trình riêng của
  TikTok.
- Shop Mall đổi phí vào các ngày khác shop thường (03/08/2026 và 20/10/2026, so
  với 03/07/2026). Khi so sánh, cần chọn đúng loại shop.

## Tra cứu trực tiếp

- **Tiếng Việt**: https://ordinex.cc/tools/phi-tiktok-shop
- **English**: https://ordinex.cc/en/tools/tiktok-shop-fees

Gõ tên ngành hàng để xem phí cũ, phí mới và mức chênh. Kèm biểu đồ cho biết mức
thay đổi trải ra thế nào trên toàn bộ danh mục, và danh sách các mốc phí TikTok
Shop Việt Nam, mỗi mốc có link về trang của TikTok.

## Giấy phép và cách ghi nguồn

Phát hành theo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bạn có
thể dùng dữ liệu cho bài viết, báo cáo hoặc sản phẩm của mình. Chỉ cần ghi
nguồn.

```
Ordinex (2026). Biểu phí hoa hồng TikTok Shop Việt Nam theo ngành hàng,
có ngày hiệu lực. So sánh 1,824 ngành. CC BY 4.0.
https://ordinex.cc/tools/phi-tiktok-shop
```

File `CITATION.cff` có cùng thông tin cho phần mềm quản lý trích dẫn và nút
"Cite this repository" của GitHub.

## Thấy số sai thì báo

Nếu mức phí ở đây không khớp với biểu phí bạn đang có, hãy mở issue và ghi rõ
tên ngành hàng cùng ngày của file PDF nguồn. Bản ghi này chỉ có giá trị khi số
liệu đúng.

---

Được duy trì bởi [Ordinex](https://ordinex.cc), phần mềm theo dõi lãi ròng cho
người bán TikTok Shop tại Việt Nam.
