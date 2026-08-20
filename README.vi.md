[English](README.md) · **Tiếng Việt**

# Biểu phí hoa hồng TikTok Shop Việt Nam theo ngành hàng, có ngày hiệu lực

Dữ liệu mở: biểu phí hoa hồng người bán của TikTok Shop Việt Nam tại hai thời
điểm, đối chiếu theo từng ngành hàng.

Mỗi lần đổi biểu phí, TikTok đăng PDF mới và thay luôn bản cũ. Bản trước không
được lưu công khai, nên sau đó không còn cách biết chính xác ngành của bạn trước
đó chịu mức phí bao nhiêu, đã tăng hay giảm thế nào. Repo này giữ lại phần lịch
sử đó.

## Phí đã thay đổi thế nào

So sánh bản hiệu lực **09/05/2026** với bản hiệu lực **03/07/2026** (shop
thường; shop Mall áp dụng từ **03/08/2026**):

| | Số ngành hàng |
|---|---:|
| Có mặt trong cả hai bản | **1.808** |
| **Tăng** phí | **1.352** |
| **Giảm** phí | **403** |
| Giữ nguyên | **53** |

Ngành tăng nhiều nhất là **Máy đọc sách điện tử**, từ **2% lên 10,5%**, tăng 8,5
điểm phần trăm.

Nói "TikTok Shop tăng phí" không sai, vì phần lớn ngành hàng đúng là tăng. Nhưng
**403 ngành thực tế được giảm**, và phần này gần như không được nhắc tới.

## Trong repo có gì

| Đường dẫn | Là gì |
|---|---|
| `data/tiktok-shop-vn-commission-diff.csv` | Bảng đối chiếu. Mỗi dòng là một ngành, có phí cũ, phí mới cho cả hai loại shop và mức chênh. |
| `data/schedule-2026-05-09.json` | Biểu phí cũ, đã bóc tách. |
| `data/schedule-2026-07-03.json` | Biểu phí mới, đã bóc tách. |
| `method/commission-diff.ts` | Code dùng để đối chiếu và tạo file CSV. |
| `method/commission-matrix.ts` | Định nghĩa kiểu dữ liệu cho hai file JSON trên. |

Cột trong CSV: `group`, `level_1`, `level_2`, `level_3`, `standard_pct_old`,
`standard_pct_new`, `standard_delta`, `mall_pct_old`, `mall_pct_new`,
`mall_delta`.

Tên ngành hàng được giữ **nguyên tiếng Việt, đúng như TikTok công bố**. Đây là
khoá để đối chiếu lại với biểu phí gốc. Nếu dịch sang ngôn ngữ khác, dữ liệu sẽ
mất khả năng kiểm chứng.

## Cách đối chiếu

Cả hai biểu phí đều được bóc trực tiếp từ file PDF của TikTok rồi so bằng
script. Không có dòng nào được nhập tay.

Ngành hàng được so khớp theo đủ bốn cấp (`group / level_1 / level_2 / level_3`).
Chỉ những ngành có trong **cả hai** bản mới được tính chênh lệch. Có **231 ngành
mới xuất hiện** và **98 ngành biến mất** giữa hai bản, nên các ngành này không
được tính vào con số 1.808.

Code đối chiếu nằm ngay trong repo, tại thư mục [`method/`](method). Đây chính
là những hàm đã tạo ra file CSV, nên bạn có thể tự chạy lại để kiểm tra kết quả.

Nếu tự đối chiếu hai biểu phí, có một chỗ rất dễ dính lỗi: cách viết hoa tên
ngành thay đổi giữa hai bản. Bản tháng 5 viết `Mẹ & bé`, bản tháng 7 viết `Mẹ &
Bé`. Nếu so khớp y nguyên từng ký tự, **cả 199 ngành sẽ âm thầm bị rụng** khỏi
kết quả. Vì vậy, khoá so khớp phải bỏ qua hoa thường và gộp khoảng trắng thừa.

## Giới hạn

Đọc phần này trước khi lấy số liệu đi trích dẫn.

- Đây **chỉ là phí hoa hồng nền tảng**. Chưa tính phí thanh toán, phí Voucher
  Xtra, phí vận chuyển hay các chương trình hỗ trợ theo quý.
- Mức phí shop bạn thực trả có thể khác nếu đang tham gia chương trình riêng của
  TikTok.
- Shop Mall áp dụng biểu phí mới muộn hơn, từ 03/08/2026 thay vì 03/07/2026 như
  shop thường. Khi so sánh, cần chọn đúng loại shop.

## Tra cứu trực tiếp

- **Tiếng Việt**: https://ordinex.cc/tools/phi-tiktok-shop
- **English**: https://ordinex.cc/en/tools/tiktok-shop-fees

Gõ tên ngành hàng để xem phí cũ, phí mới và mức chênh. Kèm biểu đồ cho biết mức
thay đổi trải ra thế nào trên toàn bộ danh mục.

## Giấy phép và cách ghi nguồn

Phát hành theo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bạn có
thể dùng dữ liệu cho bài viết, báo cáo hoặc sản phẩm của mình. Chỉ cần ghi
nguồn.

```
Ordinex (2026). Biểu phí hoa hồng TikTok Shop Việt Nam theo ngành hàng,
có ngày hiệu lực. So sánh 1.808 ngành. CC BY 4.0.
https://ordinex.cc/tools/phi-tiktok-shop
```

## Thấy số sai thì báo

Nếu mức phí ở đây không khớp với biểu phí bạn đang có, hãy mở issue và ghi rõ
tên ngành hàng cùng ngày của file PDF nguồn. Bản ghi này chỉ có giá trị khi số
liệu đúng.

---

Được duy trì bởi [Ordinex](https://ordinex.cc), nền tảng tìm nguồn hàng và tính
giá vốn cho chủ shop thương mại điện tử Việt Nam.
